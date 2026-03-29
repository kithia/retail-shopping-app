import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Cart } from 'src/entities/cart';
import { ProductService } from './product.service';
import { NEW_CART } from 'src/seeds/new-cart';
import { CronExpression } from '@nestjs/schedule/dist/enums/cron-expression.enum';
import { Cron } from '@nestjs/schedule/dist/decorators/cron.decorator';
import { DiscountService } from './discount.service';
import { CheckoutResponse, InsufficientStockInfo } from 'src/dtos/checkout.dto';

/**
 * CartService
 * This service manages the shopping cart
 * It also handles cart expiration after 2 minutes of inactivity.
 */
@Injectable()
export class CartService {
  private readonly cart: Cart = NEW_CART;
  private readonly _productService: ProductService; 
  private readonly discountService: DiscountService;

  constructor(productService: ProductService, discountService: DiscountService) {
    this._productService = productService;
    this.discountService = discountService;
  }

  /**
   * Retrieves the current state of the cart, including items, subtotal, and timestamps.
   * @returns The current cart.
   */
  get(): Cart {
    return this.cart;
  }

  /**
   * Retrieves the reserved quantity of a specific product in the cart.
   * @param productId The ID of the product.
   * @returns The quantity of the product reserved in the cart.
   * @throws NotFoundException if the product is not found in the cart.
   */
  getReservedQuantityById(productId: number): number {
    const item = this.cart.items.find(item => item.productId === productId);
    if (!item) {
      throw new NotFoundException(`Product with id ${productId} not found in cart.`);
    }
    return item.quantity;
  }

  /**
   * Adds a product to the cart by its ID and quantity.
   * @param productId The ID of the product to add.
   * @param quantity The quantity of the product to add.
   * @throws BadRequestException if the quantity is not greater than 0.
   * @throws NotFoundException if the product with the specified ID does not exist in the product catalogue.
   */
  addProductById(productId: number, quantity: number): void {
    if (quantity <= 0) {
      throw new BadRequestException('Quantity must be greater than 0.');
    }

    const existingItem = this.cart.items.find(item => item.productId === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
      this.cart.subTotal += existingItem.productPrice * quantity;
      this.cart.lastActiveAt = new Date();
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

  /**
   * Removes a product from the cart by its ID, updating the subtotal and last active timestamp accordingly.
   * @param productId The ID of the product to remove.
   * @throws NotFoundException if the product with the specified ID is not found in the cart.
   */
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

  /**
   * Reduces the quantity of a specific product in the cart by a given amount.
   * The subtotal and last active timestamp are updated accordingly.
   * @param productId The ID of the product to reduce.
   * @param quantity The quantity to reduce.
   * @throws BadRequestException if the quantity is not greater than 0.
   * @throws NotFoundException if the product with the specified ID is not found in the cart.
   */
  reduceProductQuantityById(productId: number, quantity: number): void {
    if (quantity <= 0) {
      throw new BadRequestException('Quantity must be greater than 0.');
    }

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

  /**
   * Processes the checkout of the cart, validating stock availability and applying discounts.
   * @returns The result of the checkout operation, including success status, order details, and any applied discounts.
   */
  checkout(): CheckoutResponse {
    if (this.cart.items.length === 0) {
      this.clear();
      const response: CheckoutResponse = { success: false, message: 'Cart has expired. Please add items before checkout.' };
      return response;
    }

    const insufficientStock: InsufficientStockInfo[] = [];
    for (const item of this.cart.items) {
      const product = this._productService.getById(item.productId);
      if (product && product.stock < item.quantity) {
      insufficientStock.push({
        productName: product.name,
        requested: item.quantity
      });
      }
    }

    if (insufficientStock.length > 0) {
      this.clear();
      const response: CheckoutResponse = { 
        success: false, 
        message: 'The following items are out of stock or do not have enough stock to fulfill your order:', 
        insufficientStock 
      };
      return response;
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

  /**
   * Clears the cart by removing all items, resetting the subtotal, and updating the last active timestamp.
   */
  clear(): void {
    this.cart.items = [];
    this.cart.subTotal = 0;
    this.cart.lastActiveAt = new Date();
  }

  /**
   * This method runs every 30 seconds to check if the cart has been inactive for more than 2 minutes.
   * If so, it clears the cart.
   */
  @Cron(CronExpression.EVERY_30_SECONDS)
  handleCartExpiry() {
    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000)
    
    if (this.cart.items.length > 0 && 
        this.cart.lastActiveAt <= twoMinutesAgo) {
      this.clear();
    }
  }
}