import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { OrderService } from './services/order.service';
import { OrderController } from './order.controller';
import { OrderValidation } from './order.validation';
import { ProductModule } from '../product/product.module';
import { HttpModule } from '@nestjs/axios';
import { OrderFetchService } from './services/order-fetch.service';

@Module({
  imports: [HttpModule, ProductModule, CommonModule],
  controllers: [OrderController],
  providers: [OrderService, OrderFetchService, OrderValidation],
  exports: [],
})
export class OrderModule {}
