import { Controller, Get, Param } from '@nestjs/common';
import { Product } from '../entities/product';
import { ProductService } from '../services/product.service';

/**
 * ProductController
 * This controller manages the product-related endpoints of the application.
 */
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  /**
   * Retrieves a list of all products available in the store.
   * @returns {Product[]} An array of all products.
   */
  @Get()
  getAllProducts(): Product[] {
    return this.productService.getAll();
  }

  /**
   * Retrieves the details of a specific product by its ID.
   * @param id The ID of the product to retrieve.
   * @returns {Product | undefined} The product with the specified ID, or undefined if not found.
   */
  @Get(':id')
  getProductById(@Param('id') id: string): Product | undefined {
    return this.productService.getById(Number(id));
  }
}