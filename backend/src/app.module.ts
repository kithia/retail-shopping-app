import { Module } from '@nestjs/common';
import { AppController } from './controller/app.controller';
import { ProductService } from './services/product.service';
import { ProductController } from './controller/product.controller';
import { CartService } from './services/cart.service';
import { CartController } from './controller/cart.controller';
import { ScheduleModule } from '@nestjs/schedule/dist/schedule.module';
import { DiscountService } from './services/discount.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [AppController, ProductController, CartController],
  providers: [ProductService, CartService, DiscountService],
})
export class AppModule {}
