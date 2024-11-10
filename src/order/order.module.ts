import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { OrderValidation } from './order.validation';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [ProductModule, CommonModule],
  controllers: [OrderController],
  providers: [OrderService, OrderValidation],
  exports: [],
})
export class OrderModule {}
