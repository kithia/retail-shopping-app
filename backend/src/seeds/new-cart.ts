import { Cart } from "src/entities/cart";

/**
 * NEW_CART
 * This constant represents a new, empty shopping cart with default values.
 */
export const NEW_CART: Cart = {
  id: 1,
  items: [],
  subTotal: 0,
  lastActiveAt: new Date(),
  createdAt: new Date()
};