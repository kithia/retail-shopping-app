import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Cart } from 'src/entities/cart';
import { ProductService } from './product.service';
import { NEW_CART } from 'src/seeds/new-cart';
import { CronExpression } from '@nestjs/schedule/dist/enums/cron-expression.enum';
import { Cron } from '@nestjs/schedule/dist/decorators/cron.decorator';
import { DiscountService } from './discount.service';
import { CheckoutResponse, InsufficientStockInfo } from 'src/dtos/checkout.dto';

@Injectable()
export class CartService {
  private readonly cart: Cart = NEW_CART;
  private readonly _productService: ProductService; 
  private readonly discountService: DiscountService;

  constructor(productService: ProductService, discountService: DiscountService) {
    this._productService = productService;
    this.discountService = discountService;
  }

  get(): Cart {
    return this.cart;
  }

  getReservedQuantityById(productId: number): number {
    const item = this.cart.items.find(item => item.productId === productId);
    return item ? item.quantity : 0;
  }

  addProductById(productId: number, quantity: number): void {
    const existingItem = this.cart.items.find(item => item.productId === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      const product = this._productService.getById(productId);
      if (product && product.id !== undefined && product.name !== undefined && product.price !== undefined) {
        this.cart.items.push({ productId: product.id, productName: product.name, productPrice: product.price, quantity });
        this.cart.subTotal += product.price * quantity;
        this.cart.lastActiveAt = new Date();
      } else {
        throw new NotFoundException(`Product with id ${productId} not found or missing required fields.`);
      }
    }
  }

  removeProductById(productId: number): void {
    const item = this.cart.items.find(item => item.productId === productId);
    if (item) {
      this.cart.subTotal -= item.productPrice * item.quantity;
      this.cart.items = this.cart.items.filter(item => item.productId !== productId);
      this.cart.lastActiveAt = new Date();
    } else {
      throw new NotFoundException(`Product with id ${productId} not found in cart.`);
    }
  }

  reduceProductQuantityById(productId: number, quantity: number): void {
    const item = this.cart.items.find(item => item.productId === productId);
    if (item) {
      if (item.quantity > quantity) {
        item.quantity -= quantity;
        this.cart.subTotal -= item.productPrice * quantity;
      } else {
        this.removeProductById(productId);
      }
      this.cart.lastActiveAt = new Date();
    } else {
      throw new NotFoundException(`Product with id ${productId} not found in cart.`);
    }
  }

  checkout(): CheckoutResponse {
    if (this.cart.items.length === 0) {
      this.clear();
      throw new BadRequestException({ success: false, message: 'Cart has expired. Please add items before checkout.' });
    }

    const insufficientStock: InsufficientStockInfo[] = [];
    for (const item of this.cart.items) {
      const product = this._productService.getById(item.productId);
      if (product && product.stock < item.quantity) {
      insufficientStock.push({
        productName: product.name,
        available: product.stock,
        requested: item.quantity
      });
      }
    }

    if (insufficientStock.length > 0) {
      this.clear();
      throw new BadRequestException({ 
        success: false, 
        message: 'The following items are out of stock or do not have enough stock to fulfill your order:', 
        insufficientStock 
      });
    }

    // Deduct stock for all items
    this.cart.items.forEach(item => {
      const product = this._productService.getById(item.productId);
      if (product && typeof product.stock === 'number') {
        product.stock -= item.quantity;
      }
    });

    const order = [...this.cart.items];
    const subtotal = this.cart.subTotal;
    const appliedDiscounts = this.discountService.applyDiscounts(
      this.cart.items,
      subtotal
    )
    const totalDiscount = appliedDiscounts.reduce(
      (sum, d) => sum + d.amountDeducted, 0
    )

    this.clear();
    const response: CheckoutResponse = { success: true, order, subtotal, appliedDiscounts, totalDiscount };
    return response;
  }

  clear(): void {
    this.cart.items = [];
    this.cart.subTotal = 0;
    this.cart.lastActiveAt = new Date();
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  handleCartExpiry() {
    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000)
    
    if (this.cart.items.length > 0 && 
        this.cart.lastActiveAt <= twoMinutesAgo) {
      this.clear();
    }
  }
}