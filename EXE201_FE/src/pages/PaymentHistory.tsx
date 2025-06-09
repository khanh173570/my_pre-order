import React, { useState, useEffect } from "react";
import { getUserPayments } from "../services/payment.service";
import { CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";
import Pagination from "../components/Pagination";

interface Payment {
  _id: string;
  orderId: string;
  amount: number;
  status: string;
  orderInfo: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  createdAt: string;
  completedAt?: string;
  vnpayData?: {
    vnp_TransactionNo: string;
    vnp_BankCode: string;
  };
}

const PaymentHistory: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("");

  useEffect(() => {
    loadPayments();
  }, [currentPage, statusFilter]);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const data = await getUserPayments(currentPage, 10, statusFilter || undefined);
      setPayments(data.payments);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error loading payments:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'cancelled':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Clock className="w-5 h-5 text-blue-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Thành công';
      case 'failed':
        return 'Thất bại';
      case 'cancelled':
        return 'Đã hủy';
      case 'pending':
        return 'Chờ xử lý';
      default:
        return 'Không xác định';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Lịch sử thanh toán</h1>
        
        {/* Status Filter */}
        <div className="mb-6">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="completed">Thành công</option>
            <option value="pending">Chờ xử lý</option>
            <option value="failed">Thất bại</option>
            <option value="cancelled">Đã hủy</option>
          </select>
        </div>
      </div>

      {payments.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Bạn chưa có giao dịch thanh toán nào</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {payments.map((payment) => (
              <div key={payment._id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-grow">
                    <div className="flex items-center space-x-3 mb-2">
                      {getStatusIcon(payment.status)}
                      <h3 className="text-lg font-semibold">
                        Đơn hàng #{payment.orderId}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                        {getStatusText(payment.status)}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-2">{payment.orderInfo}</p>
                    
                    <div className="text-sm text-gray-500 space-y-1">
                      <p>Thời gian: {new Date(payment.createdAt).toLocaleString('vi-VN')}</p>
                      {payment.completedAt && (
                        <p>Hoàn thành: {new Date(payment.completedAt).toLocaleString('vi-VN')}</p>
                      )}
                      {payment.vnpayData?.vnp_TransactionNo && (
                        <p>Mã GD VNPay: {payment.vnpayData.vnp_TransactionNo}</p>
                      )}
                      {payment.vnpayData?.vnp_BankCode && (
                        <p>Ngân hàng: {payment.vnpayData.vnp_BankCode}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-4 lg:mt-0 lg:text-right">
                    <p className="text-2xl font-bold text-blue-900">
                      {payment.amount.toLocaleString('vi-VN')} VND
                    </p>
                    <p className="text-sm text-gray-500">
                      {payment.items.length} sản phẩm
                    </p>
                  </div>
                </div>
                
                {/* Items List */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="font-medium mb-2">Sản phẩm:</h4>
                  <div className="space-y-1">
                    {payment.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{item.name} x{item.quantity}</span>
                        <span>{(item.price * item.quantity).toLocaleString('vi-VN')} VND</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PaymentHistory;