import { Injectable } from '@nestjs/common';
import { AppliedDiscount } from 'src/entities/applied-discount';
import { CartItem } from 'src/entities/cartItem';
import { Discount } from 'src/entities/discount';
import { DiscountType } from 'src/entities/discount-type';
import { DISCOUNTS } from 'src/seeds/discount-catalogue';

/**
 * DiscountService
 * This service manages the application of discounts to the cart during checkout.
 */
@Injectable()
export class DiscountService {
  private discounts: Discount[] = DISCOUNTS;

  /**
   * Applies all applicable discounts to the given cart items and subtotal.
   * @param items The items in the cart.
   * @param subtotal The current subtotal of the cart.
   * @returns An array of applied discounts.
   */
  applyDiscounts(items: CartItem[], subtotal: number): AppliedDiscount[] {
    const applied: AppliedDiscount[] = []

    for (const discount of this.discounts) {
      const result = this.evaluateDiscount(discount, items, subtotal)
      if (result) applied.push(result)
    }
    return applied
  }

  /**
   * Evaluates a single discount against the given cart items and subtotal.
   * @param discount The discount to evaluate.
   * @param items The items in the cart.
   * @param subtotal The current subtotal of the cart.
   * @returns The applied discount if applicable, otherwise null.
   */
  private evaluateDiscount(
    discount: Discount,
    items: CartItem[],
    subtotal: number
  ): AppliedDiscount | null {
    switch (discount.type) {
      case DiscountType.FIXED_AMOUNT:
        return this.applyFixedAmount(discount, subtotal)
      case DiscountType.BUY_X_GET_Y_FREE:
        return this.applyBuyXGetYFree(discount, items)
      default:
        return null
    }
  }

  /**
   * Applies a fixed amount discount to the given subtotal if the minimum spend requirement is met.
   * @param discount The discount to apply.
   * @param subtotal The current subtotal of the cart.
   * @returns The applied discount if applicable, otherwise null.
   */
  private applyFixedAmount(
    discount: Discount,
    subtotal: number
  ): AppliedDiscount | null {
    if (subtotal < (discount.minimumSpend ?? 0)) return null

    return {
      discountId: discount.id,
      discountName: discount.name,
      amountDeducted: discount.value,
    }
  }

  /**
   * Applies a "Buy X Get Y Free" discount to the given cart items if the conditions are met.
   * @param discount The discount to apply.
   * @param items The items in the cart.
   * @returns The applied discount if applicable, otherwise null.
   */
  private applyBuyXGetYFree(
    discount: Discount,
    items: CartItem[]
  ): AppliedDiscount | null {
    const item = items.find(item => item.productId === discount.productId)
    if (!item) return null

    const freeItems = Math.floor(
      item.quantity / (discount.buyQuantity! + discount.getFreeQuantity!)
    ) * discount.getFreeQuantity!

    if (freeItems === 0) return null

    return {
      discountId: discount.id,
      discountName: discount.name,
      amountDeducted: freeItems * item.productPrice,
    }
  }
}