import Payment from '../models/payment.model.js';
import { createVNPayUrl, verifyVNPayResponse } from '../config/vnpay.js';
import { v4 as uuidv4 } from 'uuid';

// Create payment URL
export const createPayment = async (req, res) => {
  try {
    const { amount, orderInfo, items, customerInfo } = req.body;
    const userId = req.user._id;

    // Validation
    if (!amount || !orderInfo || !items || items.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required payment information'
      });
    }

    // Generate unique order ID
    const orderId = `ORDER_${Date.now()}_${uuidv4().substring(0, 8)}`;

    // Create payment record
    const payment = await Payment.create({
      orderId,
      userId,
      amount,
      orderInfo,
      items,
      customerInfo: customerInfo || {
        name: req.user.name,
        email: req.user.email
      },
      status: 'pending'
    });

    // Get client IP
    const ipAddr = req.headers['x-forwarded-for'] ||
                   req.connection.remoteAddress ||
                   req.socket.remoteAddress ||
                   req.connection.socket.remoteAddress ||
                   req.ip ||
                   '127.0.0.1';

    // Create VNPay payment URL
    const vnpayUrl = createVNPayUrl(orderId, amount, orderInfo, ipAddr);

    res.status(200).json({
      status: 'success',
      message: 'Payment URL created successfully',
      data: {
        paymentId: payment._id,
        orderId,
        paymentUrl: vnpayUrl,
        amount,
        orderInfo
      }
    });

  } catch (error) {
    console.error('Create payment error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create payment',
      error: error.message
    });
  }
};

// Handle VNPay return
export const vnpayReturn = async (req, res) => {
  try {
    const vnp_Params = req.query;
    const isValidSignature = verifyVNPayResponse(vnp_Params);

    if (!isValidSignature) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid signature'
      });
    }

    const orderId = vnp_Params.vnp_TxnRef;
    const responseCode = vnp_Params.vnp_ResponseCode;
    const transactionStatus = vnp_Params.vnp_TransactionStatus;

    // Find payment record
    const payment = await Payment.findOne({ orderId });
    if (!payment) {
      return res.status(404).json({
        status: 'error',
        message: 'Payment not found'
      });
    }

    // Update payment status
    let status = 'failed';
    if (responseCode === '00' && transactionStatus === '00') {
      status = 'completed';
      payment.completedAt = new Date();
      payment.paymentDate = new Date();
    } else if (responseCode === '24') {
      status = 'cancelled';
    }

    payment.status = status;
    payment.vnpayData = {
      vnp_TxnRef: vnp_Params.vnp_TxnRef,
      vnp_TransactionNo: vnp_Params.vnp_TransactionNo,
      vnp_ResponseCode: responseCode,
      vnp_TransactionStatus: transactionStatus,
      vnp_BankCode: vnp_Params.vnp_BankCode,
      vnp_PayDate: vnp_Params.vnp_PayDate,
      vnp_OrderInfo: vnp_Params.vnp_OrderInfo
    };

    await payment.save();

    res.status(200).json({
      status: 'success',
      message: 'Payment processed successfully',
      data: {
        orderId,
        status,
        amount: payment.amount,
        responseCode,
        transactionNo: vnp_Params.vnp_TransactionNo
      }
    });

  } catch (error) {
    console.error('VNPay return error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to process payment return',
      error: error.message
    });
  }
};

// Handle VNPay IPN (Instant Payment Notification)
export const vnpayIPN = async (req, res) => {
  try {
    const vnp_Params = req.query;
    const isValidSignature = verifyVNPayResponse(vnp_Params);

    if (!isValidSignature) {
      return res.status(200).json({ RspCode: '97', Message: 'Invalid signature' });
    }

    const orderId = vnp_Params.vnp_TxnRef;
    const payment = await Payment.findOne({ orderId });

    if (!payment) {
      return res.status(200).json({ RspCode: '01', Message: 'Order not found' });
    }

    if (payment.amount !== parseInt(vnp_Params.vnp_Amount) / 100) {
      return res.status(200).json({ RspCode: '04', Message: 'Invalid amount' });
    }

    if (payment.status === 'completed') {
      return res.status(200).json({ RspCode: '02', Message: 'Order already confirmed' });
    }

    const responseCode = vnp_Params.vnp_ResponseCode;
    const transactionStatus = vnp_Params.vnp_TransactionStatus;

    if (responseCode === '00' && transactionStatus === '00') {
      payment.status = 'completed';
      payment.completedAt = new Date();
      payment.paymentDate = new Date();
      await payment.save();

      return res.status(200).json({ RspCode: '00', Message: 'Success' });
    } else {
      payment.status = 'failed';
      await payment.save();

      return res.status(200).json({ RspCode: '00', Message: 'Success' });
    }

  } catch (error) {
    console.error('VNPay IPN error:', error);
    return res.status(200).json({ RspCode: '99', Message: 'Unknown error' });
  }
};

// Get payment status
export const getPaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user._id;

    const payment = await Payment.findOne({ orderId, userId })
      .populate('items.productId', 'name image');

    if (!payment) {
      return res.status(404).json({
        status: 'error',
        message: 'Payment not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: payment
    });

  } catch (error) {
    console.error('Get payment status error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get payment status',
      error: error.message
    });
  }
};

// Get user payments
export const getUserPayments = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 10, status } = req.query;

    const query = { userId };
    if (status) {
      query.status = status;
    }

    const payments = await Payment.find(query)
      .populate('items.productId', 'name image')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Payment.countDocuments(query);

    res.status(200).json({
      status: 'success',
      data: {
        payments,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      }
    });

  } catch (error) {
    console.error('Get user payments error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get payments',
      error: error.message
    });
  }
};