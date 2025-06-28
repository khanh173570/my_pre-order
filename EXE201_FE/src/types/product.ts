import { Category } from "./category";

export interface Product {
  _id: string;
  id?: string; // For backward compatibility
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  status?: "active" | "inactive" | "out_of_stock" | "discontinued";
  category: Category;
  stock: number;
  image: string;
  images?: string[];
  quantity?: number; // For backward compatibility
  createdAt: string;
  updatedAt: string;
  isPreOrder?: boolean;
}
