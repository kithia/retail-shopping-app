import { Injectable } from '@nestjs/common';
import { Product } from 'src/entities/product';
import { PRODUCT_CATALOGUE } from 'src/seeds/product-catalogue';

@Injectable()
export class ProductService {
  private readonly products: Product[] = PRODUCT_CATALOGUE;

  getAll(): Product[] {
    return this.products;
  }

  getById(id: number): Product | undefined {
    return this.products.find(product => product.id === id);
  }
}