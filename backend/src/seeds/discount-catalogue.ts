import { Discount } from "src/entities/discount";
import { DiscountType } from "src/entities/discount-type";

/**
 * Discounts
 * This array defines the available discounts in the retail shopping application.
 */
export const DISCOUNTS: Discount[] = [
  {
    id: '10GBPOFF',
    name: 'Big Spender',
    description: '£10 off when you spend over £100',
    type: DiscountType.FIXED_AMOUNT,
    value: 10,
    minimumSpend: 100
  },
  {
    id: '3SHIRTSFOR2',
    name: '3 Shirts for the Price of 2',
    description: 'Buy 3 shirts for the price of 2',
    type: DiscountType.BUY_X_GET_Y_FREE,
    value: 0,
    productId: 1,
    buyQuantity: 3,
    getFreeQuantity: 1
  }
]