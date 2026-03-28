import { Controller, Get, Param } from '@nestjs/common';
import { Product } from './../entities/product';
import { ProductService } from './../services/product.service';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  getAllProducts(): Product[] {
    return this.productService.getAll();
  }

  @Get(':id')
  getProductById(@Param('id') id: string): Product | undefined {
    return this.productService.getById(Number(id));
  }
}
