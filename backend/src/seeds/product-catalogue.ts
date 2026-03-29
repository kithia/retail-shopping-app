import { Product } from './../entities/product';

/**
 * PRODUCT_CATALOGUE
 * This is a hardcoded list of products available in the store.
 */
export const PRODUCT_CATALOGUE: Product[] = [
  {
    id: 1,
    name: "Classic White Shirt",
    description: "A timeless plain white cotton shirt, perfect for any occasion.",
    price: 25.0,
    stock: 10
  },
  {
    id: 2,
    name: "Navy Blue Trousers",
    description: "Smart navy blue trousers made from high-quality fabric for comfort and style.",
    price: 40.0,
    stock: 5
  },
  {
    id: 3,
    name: "Silk Navy Tie",
    description: "Elegant navy silk tie, ideal for formal and business wear.",
    price: 15.0,
    stock: 2
  },
  {
    id: 4,
    name: "Black Leather Belt",
    description: "Classic black leather belt with a silver buckle.",
    price: 18.0,
    stock: 5
  },
  {
    id: 5,
    name: "Brown Brogue Shoes",
    description: "Traditional brown leather brogue shoes with detailed perforations.",
    price: 60.0,
    stock: 3
  },
  {
    id: 6,
    name: "Grey Wool Sweater",
    description: "Soft grey wool sweater, perfect for layering in cooler weather.",
    price: 35.0,
    stock: 8
  },
  {
    id: 7,
    name: "Plain Black Socks",
    description: "Comfortable plain black socks, suitable for everyday wear.",
    price: 5.0,
    stock: 15
  }
]