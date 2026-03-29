/**
 * AppliedDiscount
 * This interface defines the structure of an applied discount in the checkout process.
 */
export interface AppliedDiscount {
  discountId: string
  name: string
  amountDeducted: number
}