export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  userName?: string; // For backward compatibility
}

export interface AuthResponse {
  status: string;
  message: string;
  token: string;
  user: User;
  // Backward compatibility fields
  id?: string;
  userName?: string;
  roleName?: string;
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

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  image: string;
  quantity: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface PreOrderProduct {
  id: string;
  name: string;
  image: string;
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
