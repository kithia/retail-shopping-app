import client from './../client'
import { Product } from './../types/product'

export const getProducts = async (): Promise<Product[]> => {
  const response = await client.get('/products')
  return response.data
}

export const getProduct = async (id: string): Promise<Product> => {
  const response = await client.get(`/products/${id}`)
  return response.data
}