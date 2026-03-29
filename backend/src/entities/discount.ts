import { DiscountType } from "./discount-type"

export interface Discount {
  id: string
  name: string
  description: string
  type: DiscountType
  value: number              // % or £ amount depending on type
  minimumSpend?: number      // for FIXED_AMOUNT threshold
  productId?: number         // for BUY_X_GET_Y_FREE
  buyQuantity?: number       // for BUY_X_GET_Y_FREE
  getFreeQuantity?: number   // for BUY_X_GET_Y_FREE
}