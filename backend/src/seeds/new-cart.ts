import { Cart } from "src/entities/cart";

export const NEW_CART: Cart = {
  id: 1,
  items: [],
  subTotal: 0,
  lastActiveAt: new Date(),
  createdAt: new Date()
};