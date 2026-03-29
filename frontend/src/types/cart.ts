import { CartItem } from "./cartItem";

/**
 * Cart Interface
 * Represents the shopping cart containing items, subtotal, and timestamps for activity and creation.
 */
export interface Cart {
  id: number;
  items: CartItem[];
  subTotal: number;
  lastActiveAt: Date;
}