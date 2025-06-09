import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'VND'
  },
  paymentMethod: {
    type: String,
    enum: ['vnpay', 'momo', 'zalopay', 'cash'],
    default: 'vnpay'
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled'],
    default: 'pending'
  },
  vnpayData: {
    vnp_TxnRef: String,
    vnp_TransactionNo: String,
    vnp_ResponseCode: String,
    vnp_TransactionStatus: String,
    vnp_BankCode: String,
    vnp_PayDate: String,
    vnp_OrderInfo: String
  },
  orderInfo: {
    type: String,
    required: true
  },
  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    name: String,
    quantity: Number,
    price: Number
  }],
  customerInfo: {
    name: String,
    email: String,
    phone: String,
    address: String
  },
  paymentDate: Date,
  completedAt: Date
}, {
  timestamps: true
});

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;