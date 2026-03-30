import { CheckoutResponse } from '../../types/dtos/chekout-reponse'
import client from '../client'
import { Cart } from '../../types/cart'

/**
 * CartService
 * This service provides functions to interact with the shopping cart API endpoints.
 */

/**
 * Retrieves the current state of the cart.
 * @returns The current cart.
 */
export const getCart = async (): Promise<Cart> => {
  const response = await client.get('/cart')
  return response.data
}

/**
 * Adds a product to the cart by its ID and quantity.
 * @param productId The ID of the product to add.
 * @param quantity The quantity of the product to add.
 */
export const addProductToCart = async (
  productId: number,
  quantity: number
): Promise<void> => {
  await client.post('/cart/add', { productId, quantity })
}

/**
 * Removes a product from the cart by its ID.
 * @param productId The ID of the product to remove.
 */
export const removeProductFromCart = async (productId: number): Promise<void> => {
  await client.post('/cart/remove', { productId })
}

/**
 * Reduces the quantity of a product in the cart by its ID and quantity.
 * @param productId The ID of the product to reduce.
 * @param quantity The quantity to reduce.
 */
export const reduceProductQuantityInCart = async (
  productId: number,
  quantity: number
): Promise<void> => {
  await client.post('/cart/reduce', { productId, quantity })
}

/**
 * Checks out the current cart and returns the checkout response.
 * @returns The checkout response.
 */
export const checkoutCart = async (): Promise<CheckoutResponse> => {
  const response = await client.post('/cart/checkout')
  return response.data
}

/**
 * Clears the current cart.
 */
export const clearCart = async (): Promise<void> => {
  await client.post('/cart/clear')
}