import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CartService } from 'src/services/cart.service';
import type { Cart } from 'src/entities/cart';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getCart(): Cart {
    return this.cartService.get();
  }

  @Post('add')
  addProductToCart(
    @Body() body: { productId: number; quantity: number }
  ): void {
    const { productId, quantity } = body;
    this.cartService.addProductById(productId, quantity);
  }

  @Post('remove')
  removeProductFromCart(@Body() body: { productId: number }): void {
    const { productId } = body;
    this.cartService.removeProductById(productId);
  }

  @Post('reduce')
  reduceProductQuantityInCart(@Body() body: { productId: number; quantity: number }): void {
    const { productId, quantity } = body;
    this.cartService.reduceProductQuantityById(productId, quantity);
  }

  @Post('checkout')
  checkoutCart(): { success: boolean; message?: string; order?: Cart['items'] } {
    return this.cartService.checkout();
  }

  @Post('clear')
  clearCart(): void {
    this.cartService.clear();
  }
}