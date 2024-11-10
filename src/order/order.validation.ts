import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { CreateOrderDto } from './dtos/create-order.dto';
import { ProductValidation } from '../product/product.validation';
import { UserDto } from '../common/dtos/user.dto';
import { ErrorLogDto } from '../common/dtos/error-log.dto';
import { ValidateProductDto } from '../product/dtos/validate-product.dto';

@Injectable()
export class OrderValidation {
  private readonly logger = new Logger(OrderValidation.name);

  constructor(
    private prismaService: PrismaService,
    private productValidation: ProductValidation,
  ) {}

  async validateCreateOrder(
    user: UserDto,
    dtos: CreateOrderDto[],
  ): Promise<void> {
    const vendorIds = dtos.map((dto) => dto.vendorId);
    const vendorCount = await this.prismaService.vendor.count({
      where: { id: { in: [...new Set(vendorIds)] } },
    });
    if (vendorIds.length !== vendorCount) {
      this.logger.error(
        new ErrorLogDto(
          user.id,
          dtos,
          this.validateCreateOrder.name,
          'Geçersiz satıcılar',
        ),
      );
      throw new BadRequestException('Geçersiz işlem');
    }
    const productData = dtos.map((dto) => {
      return {
        productId: dto.productId,
        quantity: dto.quantity,
      } as ValidateProductDto;
    });
    await this.productValidation.validateProducts(user, productData);
  }
}
