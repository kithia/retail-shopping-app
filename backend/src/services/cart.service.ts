import { Injectable } from '@nestjs/common';
import { Cart } from 'src/entities/cart';
import { ProductService } from './product.service';
import { NEW_CART } from 'src/seeds/new-cart';
import { CartItem } from 'src/entities/cartItem';
import { CronExpression } from '@nestjs/schedule/dist/enums/cron-expression.enum';
import { Cron } from '@nestjs/schedule/dist/decorators/cron.decorator';

@Injectable()
export class CartService {
  private readonly cart: Cart = NEW_CART;
  private readonly _productService: ProductService;  

  constructor(productService: ProductService) {
    this._productService = productService;
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
        throw new Error(`Product with id ${productId} not found or missing required fields.`);
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
      throw new Error(`Product with id ${productId} not found in cart.`);
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
      throw new Error(`Product with id ${productId} not found in cart.`);
    }
  }

  checkout(): { success: boolean; message?: string; order?: CartItem[] } {
    if (this.cart.items.length === 0) {
      this.clear();
      return { success: false, message: 'Cart is empty. Please add items before checkout.' };
    }

    // Check stock for all items first
    for (const item of this.cart.items) {
      const product = this._productService.getById(item.productId);
      if (product && product.stock < item.quantity) {
        this.clear();
        return { success: false, message: `Insufficient stock for product ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}` };
      }
    }

    // Deduct stock for all items
    this.cart.items.forEach(item => {
      const product = this._productService.getById(item.productId);
      if (product && typeof product.stock === 'number') {
        product.stock -= item.quantity;
      }
    });

    const order = [...this.cart.items];
    this.clear();
    return { success: true, order };
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