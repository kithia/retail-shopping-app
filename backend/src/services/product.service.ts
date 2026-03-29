import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from 'src/entities/product';
import { PRODUCT_CATALOGUE } from 'src/seeds/product-catalogue';

/**
 * ProductService
 * This service manages the product catalogue, providing methods to retrieve all products and get a product by its ID.
 * It uses a predefined list of products from the PRODUCT_CATALOGUE seed data.
 */
@Injectable()
export class ProductService {
  private readonly products: Product[] = PRODUCT_CATALOGUE;

  /**
   * Retrieves the list of all products available in the store.
   * @returns An array of all products in the catalogue.
   */
  getAll(): Product[] {
    return this.products;
  }

  /**
   * Retrieves a product by its ID.
   * @param id The ID of the product to retrieve.
   * @returns The product with the specified ID.
   * @throws NotFoundException if the product with the specified ID does not exist.
   */
  getById(id: number): Product{
    const product = this.products.find(product => product.id === id);
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found.`);
    }
    return product;
  }
}