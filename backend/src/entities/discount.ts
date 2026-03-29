import { DiscountType } from "./discount-type"

/**
 * Discount
 * This interface defines the structure of a discount that can be applied to products in the shopping cart.
 */
export interface Discount {
  id: string
  name: string
  description: string
  type: DiscountType
  value: number

  // FIXED_AMOUNT specific 
  minimumSpend?: number   
     
  // BUY_X_GET_Y_FREE specific
  productId?: number        
  buyQuantity?: number       
  getFreeQuantity?: number   
}