import { CheckoutResponse } from '../types/dtos/chekout-reponse'
import client from './../client'
import { Cart } from './../types/cart'

export const getCart = async (): Promise<Cart> => {
  const response = await client.get('/cart')
  return response.data
}

export const addProductToCart = async (
  productId: number,
  quantity: number
): Promise<void> => {
  await client.post('/cart/add', { productId, quantity })
}

export const removeProductFromCart = async (productId: number): Promise<void> => {
  await client.post('/cart/remove', { productId })
}

export const reduceProductQuantityInCart = async (
  productId: number,
  quantity: number
): Promise<void> => {
  await client.post('/cart/reduce', { productId, quantity })
}

export const checkoutCart = async (): Promise<CheckoutResponse> => {
  const response = await client.post('/cart/checkout')
  return response.data
}

export const clearCart = async (): Promise<void> => {
  await client.post('/cart/clear')
}