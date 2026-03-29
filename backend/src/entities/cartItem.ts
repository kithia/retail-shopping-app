/**
 * CartItem
 * This interface defines the structure of an item in the shopping cart, including product details and quantity.
 */
export interface CartItem {
  productId: number;
  productName: string;
  productPrice: number;
  quantity: number
}