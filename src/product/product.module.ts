import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { ProductValidation } from './product.validation';

@Module({
  imports: [CommonModule],
  controllers: [],
  providers: [ProductValidation],
  exports: [ProductValidation],
})
export class ProductModule {}
