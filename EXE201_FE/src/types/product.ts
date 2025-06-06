import { Category } from "./category";

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  stock: number;
  image: string;
  createdAt: string;
  updatedAt: string;
}
