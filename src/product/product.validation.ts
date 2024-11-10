import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { ValidateProductDto } from './dtos/validate-product.dto';
import { ErrorLogDto } from '../common/dtos/error-log.dto';
import { UserDto } from '../common/dtos/user.dto';

@Injectable()
export class ProductValidation {
  private readonly logger = new Logger(ProductValidation.name);

  constructor(private prismaService: PrismaService) {}

  async validateProducts(
    user: UserDto,
    dtos: ValidateProductDto[],
  ): Promise<void> {
    const productIds = dtos.map((dto) => dto.productId);
    const products = await this.prismaService.product.findMany({
      where: { id: { in: [...new Set(productIds)] } },
    });
    if (productIds.length !== products.length) {
      this.logger.error(
        new ErrorLogDto(
          user.id,
          dtos,
          this.validateProducts.name,
          'Geçersiz ürünler',
        ),
      );
      throw new BadRequestException('Geçersiz işlem');
    }
    // for (const product of products) {
    //   if (product.quantity == 0) {
    //     this.logger.error(
    //       new ErrorLogDto(
    //         user.id,
    //         product,
    //         this.validateProducts.name,
    //         'Stokta ürün yok',
    //       ),
    //     );
    //     throw new BadRequestException(`${product.name} için stokta ürün yok`);
    //   }
    // }
  }
}
