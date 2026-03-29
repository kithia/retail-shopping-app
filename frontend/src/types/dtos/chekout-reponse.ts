import { AppliedDiscount } from "../applied-discount"
import { CartItem } from "../cartItem"

export interface CheckoutResponse {
  success: boolean
  message?: string
  order?: CartItem[]
  subtotal?: number
  appliedDiscounts?: AppliedDiscount[]
  totalDiscount?: number
}