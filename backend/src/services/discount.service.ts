import { Injectable } from '@nestjs/common';
import { AppliedDiscount } from 'src/entities/applied-discount';
import { CartItem } from 'src/entities/cartItem';
import { Discount } from 'src/entities/discount';
import { DiscountType } from 'src/entities/discount-type';

@Injectable()
export class DiscountService {
  private discounts: Discount[] = []

  applyDiscounts(items: CartItem[], subtotal: number): AppliedDiscount[] {
    const applied: AppliedDiscount[] = []

    for (const discount of this.discounts) {
      const result = this.evaluateDiscount(discount, items, subtotal)
      if (result) applied.push(result)
    }

    return applied
  }

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

  private applyFixedAmount(
    discount: Discount,
    subtotal: number
  ): AppliedDiscount | null {
    if (subtotal < (discount.minimumSpend ?? 0)) return null

    return {
      discountId: discount.id,
      name: discount.name,
      amountDeducted: discount.value,
    }
  }

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
      name: discount.name,
      amountDeducted: freeItems * item.productPrice,
    }
  }
}