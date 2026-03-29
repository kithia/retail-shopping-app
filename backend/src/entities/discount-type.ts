/**
 * DiscountType
 * This enum defines the types of discounts that can be applied to products in the shopping cart.
 * - FIXED_AMOUNT: A specific amount is deducted from the product price (e.g., £5 off).
 * - PERCENTAGE: A percentage is deducted from the product price (e.g., 10% off).
 * - BUY_X_GET_Y_FREE: A promotion where buying a certain quantity of a product entitles the customer to receive additional units for free (e.g., Buy 2 get 1 free).
 */
export enum DiscountType {
  FIXED_AMOUNT = 'FIXED_AMOUNT',          
  BUY_X_GET_Y_FREE = 'BUY_X_GET_Y_FREE',  
} 