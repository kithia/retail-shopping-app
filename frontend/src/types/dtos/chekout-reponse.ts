import { AppliedDiscount } from "../applied-discount"
import { CartItem } from "../cartItem"

/**
 * Checkout Response DTO
 * Represents the response returned after processing a checkout operation.
 */

export interface InsufficientStockInfo {
  productName: string
  requested: number
  available: number
}

export interface CheckoutResponse {
  success: boolean
  message?: string
  order?: CartItem[]
  subtotal?: number
  appliedDiscounts?: AppliedDiscount[]
  totalDiscount?: number
  insufficientStock?: InsufficientStockInfo[]
}