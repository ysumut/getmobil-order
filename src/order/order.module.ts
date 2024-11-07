import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';

@Module({
  imports: [CommonModule],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
