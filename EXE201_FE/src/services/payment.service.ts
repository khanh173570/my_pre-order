const API_BASE_URL = import.meta.env.VITE_API_URL;

export interface PaymentRequest {
  amount: number;
  orderInfo: string;
  items: Array<{
    productId?: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  customerInfo?: {
    name: string;
    email: string;
    phone?: string;
    address?: string;
  };
}

export interface PaymentResponse {
  status: string;
  message: string;
  data: {
    paymentId: string;
    orderId: string;
    paymentUrl: string;
    amount: number;
    orderInfo: string;
  };
}

export interface PaymentStatus {
  orderId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  amount: number;
  orderInfo: string;
  items: Array<{
    productId: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  customerInfo: {
    name: string;
    email: string;
    phone?: string;
    address?: string;
  };
  vnpayData?: {
    vnp_TxnRef: string;
    vnp_TransactionNo: string;
    vnp_ResponseCode: string;
    vnp_TransactionStatus: string;
    vnp_BankCode: string;
    vnp_PayDate: string;
  };
  createdAt: string;
  completedAt?: string;
}

export const createPayment = async (paymentData: PaymentRequest): Promise<PaymentResponse> => {
  try {
    const token = JSON.parse(localStorage.getItem('auth') || '{}').token;
    
    const response = await fetch(`${API_BASE_URL}/payment/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(paymentData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create payment');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Create payment error:', error);
    throw error;
  }
};

export const getPaymentStatus = async (orderId: string): Promise<PaymentStatus> => {
  try {
    const token = JSON.parse(localStorage.getItem('auth') || '{}').token;
    
    const response = await fetch(`${API_BASE_URL}/payment/status/${orderId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to get payment status');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Get payment status error:', error);
    throw error;
  }
};

export const getUserPayments = async (page = 1, limit = 10, status?: string) => {
  try {
    const token = JSON.parse(localStorage.getItem('auth') || '{}').token;
    
    let url = `${API_BASE_URL}/payment/user-payments?page=${page}&limit=${limit}`;
    if (status) {
      url += `&status=${status}`;
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to get payments');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Get user payments error:', error);
    throw error;
  }
};