import { CartItem } from "./cartItem";

export interface Cart {
  id: number;
  items: CartItem[];
  subTotal: number;
  lastActiveAt: Date;
  createdAt: Date;
}