import client from '../client'
import { Product } from '../../types/product'

/**
 * ProductService
 * This service provides functions to interact with the product API endpoints.
 */

/**
 * Retrieves all products.
 * @returns A list of products.
 */
export const getProducts = async (): Promise<Product[]> => {
  const response = await client.get('/products')
  return response.data
}

/**
 * Retrieves a product by its ID.
 * @param id The ID of the product to retrieve.
 * @returns The product with the specified ID.
 */
export const getProduct = async (id: string): Promise<Product> => {
  const response = await client.get(`/products/${id}`)
  return response.data
}