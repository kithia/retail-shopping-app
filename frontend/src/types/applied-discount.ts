/**
 * Applied Discount Interface
 * Represents a discount that has been applied to the cart during checkout.
 */
export interface AppliedDiscount {
  discountId: string
  discountName: string
  amountDeducted: number
}