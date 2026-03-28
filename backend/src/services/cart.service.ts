import { Injectable } from '@nestjs/common';
import { Cart } from 'src/entities/cart/cart';
import { ProductService } from './product.service';

@Injectable()
export class CartService {
  private readonly _productService: ProductService;

  private readonly cart: Cart = {
    id: 1,
    items: [],
    subTotal: 0,
    lastActiveAt: new Date(),
    createdAt: new Date(),
  };

  constructor(productService: ProductService) {
    this._productService = productService;
  }

  get(): Cart {
    return this.cart;
  }

  addProduct(productId: number, quantity: number): void {
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

  removeProduct(productId: number): void {
    const item = this.cart.items.find(item => item.productId === productId);
    if (item) {
      this.cart.subTotal -= item.productPrice * item.quantity;
      this.cart.items = this.cart.items.filter(item => item.productId !== productId);
      this.cart.lastActiveAt = new Date();
    } else {
      throw new Error(`Product with id ${productId} not found in cart.`);
    }
  }

  reduceProductQuantity(productId: number, quantity: number): void {
    const item = this.cart.items.find(item => item.productId === productId);
    if (item) {
      if (item.quantity > quantity) {
        item.quantity -= quantity;
        this.cart.subTotal -= item.productPrice * quantity;
      } else {
        this.removeProduct(productId);
      }
      this.cart.lastActiveAt = new Date();
    } else {
      throw new Error(`Product with id ${productId} not found in cart.`);
    }
  }

  clear(): void {
    this.cart.items = [];
    this.cart.subTotal = 0;
    this.cart.lastActiveAt = new Date();
  }
}