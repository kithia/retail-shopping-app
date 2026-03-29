import { CartItem } from "./cartItem";

/**
 * Cart
 * This interface defines the structure of the shopping cart object used in the application.
 */
export interface Cart {
  id: number;
  items: CartItem[];
  subTotal: number;
  lastActiveAt: Date;
}