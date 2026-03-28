import { Controller, Get, Param, Post } from '@nestjs/common';
import { CartService } from 'src/services/cart.service';
import type { Cart } from 'src/entities/cart/cart';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getCart(): Cart {
    return this.cartService.get();
  }

  @Post('add/:productId/:quantity')
  addProductToCart(@Param('productId') productId: string, @Param('quantity') quantity: string): void {
    this.cartService.addProduct(Number(productId), Number(quantity));
  }

  @Post('remove/:productId')
  removeProductFromCart(@Param('productId') productId: string): void {
    this.cartService.removeProduct(Number(productId));
  }

  @Post('reduce/:productId/:quantity')
  reduceProductQuantityInCart(@Param('productId') productId: string, @Param('quantity') quantity: string): void {
    this.cartService.reduceProductQuantity(Number(productId), Number(quantity));
  }

  @Post('clear')
  clearCart(): void {
    this.cartService.clear();
  }
}