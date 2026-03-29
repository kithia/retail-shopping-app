import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CartService } from 'src/services/cart.service';
import type { Cart } from 'src/entities/cart';

/**
 * CartController
 * This controller manages the shopping cart functionality of the application.
 */
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  /**
   * Retrieves the current state of the shopping cart.
   * @returns {Cart} The current cart object.
   */
  @Get()
  getCart(): Cart {
    return this.cartService.get();
  }

  /**
   * Adds a product to the shopping cart.
   * @param body An object containing the productId and quantity to add.
   */
  @Post('add')
  addProductToCart(
    @Body() body: { productId: number; quantity: number }
  ): void {
    const { productId, quantity } = body;
    this.cartService.addProductById(productId, quantity);
  }

  /**
   * Removes a product from the shopping cart.
   * @param body An object containing the productId to remove.
   */
  @Post('remove')
  removeProductFromCart(@Body() body: { productId: number }): void {
    const { productId } = body;
    this.cartService.removeProductById(productId);
  }

  /**
   * Reduces the quantity of a product in the shopping cart.
   * @param body An object containing the productId and quantity to reduce.
   */
  @Post('reduce')
  reduceProductQuantityInCart(@Body() body: { productId: number; quantity: number }): void {
    const { productId, quantity } = body;
    this.cartService.reduceProductQuantityById(productId, quantity);
  }

  /**
   * Checks out the shopping cart and creates an order.
   * @returns An object containing the success status, optional message, and optional order details.
   */
  @Post('checkout')
  checkoutCart(): { success: boolean; message?: string; order?: Cart['items'] } {
    return this.cartService.checkout();
  }

  /**
   * Clears all items from the shopping cart.
   */
  @Post('clear')
  clearCart(): void {
    this.cartService.clear();
  }
}