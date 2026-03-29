import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from 'src/entities/product';
import { PRODUCT_CATALOGUE } from 'src/seeds/product-catalogue';

@Injectable()
export class ProductService {
  private readonly products: Product[] = PRODUCT_CATALOGUE;

  getAll(): Product[] {
    return this.products;
  }

  getById(id: number): Product{
    const product = this.products.find(product => product.id === id);
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found.`);
    }
    return product;
  }
}