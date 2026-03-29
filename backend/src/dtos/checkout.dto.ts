import { AppliedDiscount } from "src/entities/applied-discount"
import { CartItem } from "src/entities/cartItem"

/**
 * CheckoutReponse
 * This interface defines the structure of the response returned by the checkout endpoint.
 */

export interface InsufficientStockInfo {
  productName: string
  requested: number
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