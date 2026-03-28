import { Product } from "../product";

export interface CartItem {
  productId: number;
  productName: string;
  productPrice: number;
  quantity: number
}