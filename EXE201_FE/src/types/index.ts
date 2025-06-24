export interface User {
  id: number;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  roles: string[];
}

export interface AuthResponse {
  succeeded: boolean;
  message: string;
  errors: string[] | null;
  data: {
    accessToken: string;
    user: User;
  };
  // Backward compatibility fields
  token?: string;
  status?: string;
  id?: string;
  userName?: string;
  roleName?: string;
  firstName?: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  address: string;
  role?: string;
}

export interface RegisterResponse {
  status: string;
  message: string;
  data: {
    userId: string;
    email: string;
    message: string;
  };
}

export interface Brand {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface Category {
  id: number;
  categoryName: string;
  description: string;
}

export interface ProductAsset {
  id: number;
  mediaKey: string;
  publicId: string;
  imageUrl: string;
  version: number;
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface Product {
  id: number;
  productCode: string;
  productName: string;
  description: string;
  categoryId: number;
  brandId: number | null;
  type: string;
  size: string;
  stockQuantity: number;
  productDetails: string;
  price: number;
  openedAt: number | null;
  isPreOrder: boolean;
  version: number;
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
  productAssets: ProductAsset[];
  // Backward compatibility fields
  name?: string;
  image?: string;
  images?: string[];
  quantity?: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Payment {
  id: number;
  paymentCode: string;
  paymentType: string;
  content: string;
  amount: number;
  paymentStatus: string;
}

export interface Order {
  id: number;
  userId: number;
  customerName: string;
  email: string;
  phone: string;
  userAddressId: number;
  address: string;
  status: string;
  depositPrice: number | null;
  shippingFee: number | null;
  totalPrice: number | null;
  isPreorder: boolean;
  payments: Payment[];
  shipping: any;
}

export interface PreOrderProduct {
  id: string;
  name: string;
  image: string; // Main image for backward compatibility
  images?: string[]; // Array of all images
  releaseDate: string;
  description: string;
  deadline: {
    hours: number;
    minutes: number;
    seconds: number;
  };
  currentQuantity: number;
  targetQuantity: number;
}
