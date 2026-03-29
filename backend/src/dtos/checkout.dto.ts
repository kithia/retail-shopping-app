import { AppliedDiscount } from "src/entities/applied-discount"
import { CartItem } from "src/entities/cartItem"

export interface CheckoutResponse {
  success: boolean
  message?: string
  order?: CartItem[]
  subtotal?: number
  appliedDiscounts?: AppliedDiscount[]
  totalDiscount?: number
}