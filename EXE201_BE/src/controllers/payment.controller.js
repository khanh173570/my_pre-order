import crypto from "crypto";
import moment from "moment";
import querystring from "qs";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import dotenv from "dotenv";
import { sortParams } from "../utils/sortParams.js"; // Assuming you have a utility function for sorting params
dotenv.config();

class PaymentController {
  async createPayment(req, res) {
    try {
      const {
        amount,
        orderDescription,
        orderType,
        items,
        shippingInfo,
        language = "vn",
      } = req.body;

      // Validate amount
      if (!amount || amount <= 0) {
        return res.status(400).json({
          code: "04",
          message: "Invalid amount",
          data: null,
        });
      }

      // Ensure amount is an integer
      const finalAmount = Math.round(amount);
      if (finalAmount < 1000) {
        return res.status(400).json({
          code: "04",
          message: "Amount must be at least 1000 VND",
          data: null,
        });
      }

      // Validate items
      if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({
          code: "05",
          message: "Invalid items",
          data: null,
        });
      }

      // Calculate total from items to verify amount
      const calculatedTotal = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      // Allow small variance due to rounding
      if (Math.abs(calculatedTotal - finalAmount) > 1) {
        return res.status(400).json({
          code: "06",
          message: "Amount mismatch",
          data: null,
        });
      } // Create order in database
      const order = await Order.create({
        user: req.user._id,
        items: items,
        totalAmount: finalAmount,
        paymentStatus: "pending",
        status: "pending",
        shippingAddress: shippingInfo
          ? {
              address: shippingInfo.address,
              city: shippingInfo.city || "",
              postalCode: "",
              country: "Vietnam",
            }
          : null,
        shippingInfo: shippingInfo || null,
      });
      console.log("order", order);
      // Get client IP address - ensure IPv4 format
      const ipAddr =
        req.ip === "::1"
          ? "127.0.0.1"
          : req.ip ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            "127.0.0.1";

      // Create date in Vietnam timezone (GMT+7) in VNPay format (YYYYMMDDHHmmss)
      const createDate = moment().format("YYYYMMDDHHmmss");
      const orderId = order._id.toString();

      // Clean order description - VNPay specific requirements
      const cleanOrderDescription = (orderDescription || "Thanh toan don hang")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
        .replace(/[^a-zA-Z0-9\s]/g, "") // Remove special chars
        .replace(/\s+/g, " ")
        .trim()
        .substring(0, 100);

      // VNPay parameters
      let vnpParams = {
        vnp_Version: "2.1.0",
        vnp_Command: "pay",
        vnp_TmnCode: process.env.VNP_TMNCODE,
        vnp_Locale: language === "en" ? "en" : "vn",
        vnp_CurrCode: "VND",
        vnp_TxnRef: orderId,
        vnp_OrderInfo: cleanOrderDescription,
        vnp_OrderType: "other",
        vnp_Amount: finalAmount * 100, // Convert to smallest currency unit (cents)
        vnp_ReturnUrl: process.env.VNP_RETURNURL,
        vnp_IpAddr: ipAddr,
        vnp_CreateDate: createDate,
      };

      // Log parameters for debugging
      console.log("VNPay params 01:", vnpParams);

      vnpParams = Object.entries(vnpParams)
        .sort(([key1], [key2]) =>
          key1.toString().localeCompare(key2.toString())
        )
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {});
      console.log(" VNPay params 02:", vnpParams);

      // Sort parameters by field name
      // const sortedParams = this.sortObject(vnpParams);

      // Create query string for signing
      // const signData = Object.keys(sortedParams)
      //   .map((key) => `${key}=${sortedParams[key]}`)
      //   .join("&"); // Log data before creating signature
      // console.log("Sign data before hash:", signData);
      // console.log("Hash secret used:", process.env.VNP_HASHSECRET);

      // // Create signature
      // const hmac = crypto.createHmac("sha512", process.env.VNP_HASHSECRET);
      // const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

      // // Log the generated secure hash
      // console.log("Generated SecureHash:", signed);

      // // Add signature to sorted params
      // sortedParams.vnp_SecureHash = signed;

      // // Log all parameters that will be sent to VNPay
      // console.log("All VNPay parameters:", sortedParams);

      // // Build payment URL with parameters in alphabetical order
      // const paymentUrl = `${process.env.VNP_URL}?${Object.keys(sortedParams)
      //   .map((key) => `${key}=${encodeURIComponent(sortedParams[key])}`)
      //   .join("&")}`;
      const urlParams = new URLSearchParams();
      for (let [key, value] of Object.entries(vnpParams)) {
        urlParams.append(key, String(value));
      }

      const querystring = urlParams.toString();

      const hmac = crypto.createHmac("sha512", process.env.VNP_HASHSECRET);
      const signed = hmac.update(querystring).digest("hex");

      urlParams.append("vnp_SecureHash", signed);

      const paymentUrl = `${process.env.VNP_URL}?${urlParams.toString()}`;

      console.log("Generated VNPay URL:", paymentUrl);

      // Return success response with payment URL
      return res.status(200).json({
        code: "00",
        message: "Success",
        data: paymentUrl,
        orderId: orderId,
      });
    } catch (error) {
      console.error("Payment creation error:", error);
      return res.status(500).json({
        code: "99",
        message: "Internal server error",
        error: error.message,
      });
    }
  }
  async vnpayReturn(req, res) {
    try {
      // Get all query parameters
      const vnpParams = req.query;
      console.log("VNPay return parameters:", vnpParams);

      // Extract secure hash from query
      const secureHash = vnpParams.vnp_SecureHash;
      console.log("Received SecureHash:", secureHash);

      // Get order ID
      const orderId = vnpParams.vnp_TxnRef;
      console.log("Order ID from VNPay:", orderId);

      // Remove hash and hash type from params
      delete vnpParams.vnp_SecureHash;
      delete vnpParams.vnp_SecureHashType;

      // Sort the parameters
      // const sortedParams = this.sortObject(vnpParams);
      // console.log("Sorted parameters for verification:", sortedParams);

      // Create query string for verification
      // const signData = Object.keys(sortedParams)
      //   .map((key) => `${key}=${sortedParams[key]}`)
      //   .join("&");
      // console.log("Sign data for verification:", signData);
      const sortedQuery = sortParams(vnpParams);

      const urlParams = new URLSearchParams();
      for (let [key, value] of Object.entries(sortedQuery)) {
        urlParams.append(key, value);
      }
      const querystring = urlParams.toString();
      // Create verification signature
      const hmac = crypto.createHmac("sha512", process.env.VNP_HASHSECRET);
      const signed = hmac.update(querystring).digest("hex");
      console.log("Generated verification hash:", signed); // Verify signature
      console.log(
        "Hash verification result:",
        secureHash === signed ? "VALID" : "INVALID"
      );
      urlParams.append("vnp_SecureHash", signed);
      console.log("secureHash", secureHash);
      console.log("signed", signed);

      if (secureHash === signed) {
        // Get response code
        const responseCode = vnpParams.vnp_ResponseCode; // Payment successful
        if (responseCode === "00") {
          // Get the order details to update product stock
          const order = await Order.findById(orderId).populate("items.product");

          if (order) {
            // Update product stock for each item in the order
            for (const item of order.items) {
              await Product.findByIdAndUpdate(item.product, {
                $inc: { stock: -item.quantity },
              });
            }
          }

          // Update order status
          await Order.findByIdAndUpdate(orderId, {
            paymentStatus: "completed",
            status: "processing",
            transactionId: vnpParams.vnp_TransactionNo,
            paymentDate: vnpParams.vnp_PayDate,
          });

          return res.redirect("http://localhost:5173/result?status=success");
        } else {
          // Payment failed
          await Order.findByIdAndUpdate(orderId, {
            paymentStatus: "failed",
            status: "cancelled",
            transactionId: vnpParams.vnp_TransactionNo,
            paymentDate: vnpParams.vnp_PayDate,
          });

          return res.redirect("http://localhost:5173/result?status=fail");
        }
      } else {
        // Invalid signature
        await Order.findByIdAndUpdate(orderId, {
          paymentStatus: "failed",
          status: "cancelled",
        });

        return res.redirect("http://localhost:5173/result?status=fail");
      }
    } catch (error) {
      console.error("Payment return error:", error);

      return res.status(500).json({
        code: "99",
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // Helper function to sort object by key
  sortObject(obj) {
    const sorted = {};
    const keys = Object.keys(obj).sort();

    keys.forEach((key) => {
      if (obj[key]) {
        sorted[key] = obj[key];
      }
    });

    return sorted;
  }
}

const paymentController = new PaymentController();

export const createPayment =
  paymentController.createPayment.bind(paymentController);
export const vnpayReturn =
  paymentController.vnpayReturn.bind(paymentController);
