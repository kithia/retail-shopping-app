import { Module } from '@nestjs/common';
import { AppController } from './controller/app.controller';
import { ProductService } from './services/product.service';
import { ProductController } from './controller/product.controller';

@Module({
  imports: [],
  controllers: [AppController, ProductController],
  providers: [ProductService],
})
export class AppModule {}
