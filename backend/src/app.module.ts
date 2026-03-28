import { Module } from '@nestjs/common';
import { AppController } from './controller/app.controller';
import { ProductService } from './services/product.service';
import { ProductController } from './controller/product.controller';
import { CartService } from './services/cart.service';
import { CartController } from './controller/cart.controller';

@Module({
  imports: [],
  controllers: [AppController, ProductController, CartController],
  providers: [ProductService, CartService],
})
export class AppModule {}
