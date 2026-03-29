/**
 * Product Interface
 * Represents a product available in the store, including its ID, name, description, price, and stock quantity.
 */
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
}