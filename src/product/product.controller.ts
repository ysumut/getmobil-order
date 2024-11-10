import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Controller, Get } from '@nestjs/common';
import { GeneralResponseDto } from '../common/dtos/general-response.dto';
import { ProductService } from './product.service';

@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get()
  @ApiBearerAuth()
  @ApiOkResponse({ type: GeneralResponseDto })
  async getProducts(): Promise<GeneralResponseDto> {
    const products = await this.productService.getProducts();
    return new GeneralResponseDto().setData(products);
  }
}
