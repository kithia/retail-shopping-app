/**
 * Cart Item Interface
 * Represents an individual item in the shopping cart, including product details and quantity.
 */
export interface CartItem {
  productId: number;
  productName: string;
  productPrice: number;
  quantity: number
}