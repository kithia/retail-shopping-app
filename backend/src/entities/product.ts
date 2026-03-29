/**
 * Product
 * This interface defines the structure of a product in the retail shopping application, including its ID, name, description, price, and available stock.
 */
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
}