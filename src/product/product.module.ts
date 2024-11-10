import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { ProductValidation } from './product.validation';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  imports: [CommonModule],
  controllers: [ProductController],
  providers: [ProductService, ProductValidation],
  exports: [ProductService, ProductValidation],
})
export class ProductModule {}
