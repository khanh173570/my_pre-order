import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { getPaymentStatus, PaymentStatus } from "../services/payment.service";
import { CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";

const PaymentReturn: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [paymentData, setPaymentData] = useState<PaymentStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processPaymentReturn = async () => {
      try {
        // Get parameters from URL
        const vnp_TxnRef = searchParams.get('vnp_TxnRef');
        const vnp_ResponseCode = searchParams.get('vnp_ResponseCode');
        const vnp_TransactionStatus = searchParams.get('vnp_TransactionStatus');

        if (!vnp_TxnRef) {
          setError('Không tìm thấy thông tin đơn hàng');
          setLoading(false);
          return;
        }

        // Get payment status from backend
        const payment = await getPaymentStatus(vnp_TxnRef);
        setPaymentData(payment);

      } catch (err) {
        console.error('Error processing payment return:', err);
        setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi xử lý thanh toán');
      } finally {
        setLoading(false);
      }
    };

    processPaymentReturn();
  }, [searchParams]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-16 h-16 text-green-500" />;
      case 'failed':
        return <XCircle className="w-16 h-16 text-red-500" />;
      case 'cancelled':
        return <AlertCircle className="w-16 h-16 text-yellow-500" />;
      default:
        return <Clock className="w-16 h-16 text-blue-500" />;
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          title: 'Thanh toán thành công!',
          message: 'Đơn hàng của bạn đã được thanh toán thành công. Chúng tôi sẽ xử lý và giao hàng trong thời gian sớm nhất.',
          color: 'text-green-600'
        };
      case 'failed':
        return {
          title: 'Thanh toán thất bại!',
          message: 'Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại hoặc liên hệ hỗ trợ.',
          color: 'text-red-600'
        };
      case 'cancelled':
        return {
          title: 'Thanh toán đã bị hủy',
          message: 'Bạn đã hủy giao dịch thanh toán. Đơn hàng chưa được xử lý.',
          color: 'text-yellow-600'
        };
      default:
        return {
          title: 'Đang xử lý thanh toán',
          message: 'Giao dịch đang được xử lý. Vui lòng chờ trong giây lát.',
          color: 'text-blue-600'
        };
    }
  };

  const getResponseCodeMessage = (code: string) => {
    const codes: { [key: string]: string } = {
      '00': 'Giao dịch thành công',
      '07': 'Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường).',
      '09': 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng.',
      '10': 'Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần',
      '11': 'Giao dịch không thành công do: Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch.',
      '12': 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa.',
      '13': 'Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch (OTP).',
      '24': 'Giao dịch không thành công do: Khách hàng hủy giao dịch',
      '51': 'Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch.',
      '65': 'Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày.',
      '75': 'Ngân hàng thanh toán đang bảo trì.',
      '79': 'Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định.',
      '99': 'Các lỗi khác (lỗi còn lại, không có trong danh sách mã lỗi đã liệt kê)'
    };
    return codes[code] || 'Lỗi không xác định';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang xử lý kết quả thanh toán...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-red-600 mb-4">Có lỗi xảy ra</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/products')}
            className="bg-blue-900 text-white px-6 py-2 rounded-md hover:bg-blue-800"
          >
            Quay lại mua sắm
          </button>
        </div>
      </div>
    );
  }

  if (!paymentData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Không tìm thấy thông tin thanh toán</p>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusMessage(paymentData.status);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
          {/* Status Icon and Message */}
          <div className="text-center mb-8">
            <div className="mb-4">
              {getStatusIcon(paymentData.status)}
            </div>
            <h1 className={`text-3xl font-bold mb-4 ${statusInfo.color}`}>
              {statusInfo.title}
            </h1>
            <p className="text-gray-600 text-lg">
              {statusInfo.message}
            </p>
          </div>

          {/* Payment Details */}
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-xl font-semibold mb-4">Chi tiết thanh toán</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-500">Mã đơn hàng</label>
                <p className="text-lg font-mono">{paymentData.orderId}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500">Số tiền</label>
                <p className="text-lg font-semibold text-blue-900">
                  {paymentData.amount.toLocaleString('vi-VN')} VND
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500">Trạng thái</label>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  paymentData.status === 'completed' ? 'bg-green-100 text-green-800' :
                  paymentData.status === 'failed' ? 'bg-red-100 text-red-800' :
                  paymentData.status === 'cancelled' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {paymentData.status === 'completed' ? 'Thành công' :
                   paymentData.status === 'failed' ? 'Thất bại' :
                   paymentData.status === 'cancelled' ? 'Đã hủy' : 'Đang xử lý'}
                </span>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500">Thời gian</label>
                <p className="text-lg">
                  {new Date(paymentData.createdAt).toLocaleString('vi-VN')}
                </p>
              </div>
            </div>

            {/* VNPay Transaction Details */}
            {paymentData.vnpayData && (
              <div className="bg-gray-50 p-4 rounded-md mb-6">
                <h3 className="font-medium mb-3">Thông tin giao dịch VNPay</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  {paymentData.vnpayData.vnp_TransactionNo && (
                    <div>
                      <span className="text-gray-500">Mã giao dịch VNPay:</span>
                      <p className="font-mono">{paymentData.vnpayData.vnp_TransactionNo}</p>
                    </div>
                  )}
                  {paymentData.vnpayData.vnp_BankCode && (
                    <div>
                      <span className="text-gray-500">Ngân hàng:</span>
                      <p>{paymentData.vnpayData.vnp_BankCode}</p>
                    </div>
                  )}
                  {paymentData.vnpayData.vnp_ResponseCode && (
                    <div className="md:col-span-2">
                      <span className="text-gray-500">Kết quả:</span>
                      <p>{getResponseCodeMessage(paymentData.vnpayData.vnp_ResponseCode)}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Order Items */}
            <div className="mb-6">
              <h3 className="font-medium mb-3">Sản phẩm đã mua</h3>
              <div className="space-y-3">
                {paymentData.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">Số lượng: {item.quantity}</p>
                    </div>
                    <p className="font-semibold">
                      {(item.price * item.quantity).toLocaleString('vi-VN')} VND
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer Information */}
            <div className="mb-8">
              <h3 className="font-medium mb-3">Thông tin khách hàng</h3>
              <div className="bg-gray-50 p-4 rounded-md">
                <p><strong>Tên:</strong> {paymentData.customerInfo.name}</p>
                <p><strong>Email:</strong> {paymentData.customerInfo.email}</p>
                {paymentData.customerInfo.phone && (
                  <p><strong>Điện thoại:</strong> {paymentData.customerInfo.phone}</p>
                )}
                {paymentData.customerInfo.address && (
                  <p><strong>Địa chỉ:</strong> {paymentData.customerInfo.address}</p>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/products"
              className="bg-blue-900 text-white px-6 py-3 rounded-md hover:bg-blue-800 text-center"
            >
              Tiếp tục mua sắm
            </Link>
            <Link
              to="/history"
              className="border border-blue-900 text-blue-900 px-6 py-3 rounded-md hover:bg-blue-50 text-center"
            >
              Xem lịch sử đơn hàng
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentReturn;