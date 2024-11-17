import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { ErrorLogDto } from '../common/dtos/error-log.dto';
import { UserDto } from '../common/dtos/user.dto';
import { CreateOrderDto } from '../order/dtos/create-order.dto';

@Injectable()
export class ProductValidation {
  private readonly logger = new Logger(ProductValidation.name);

  constructor(private prismaService: PrismaService) {}

  async validateProducts(user: UserDto, dtos: CreateOrderDto[]) {
    const productVendors = await this.prismaService.productVendor.findMany({
      where: {
        OR: dtos.map((dto) => {
          return {
            productId: dto.productId,
            vendorId: dto.vendorId,
            quantity: { gte: dto.quantity },
          };
        }),
      },
    });
    if (dtos.length !== productVendors.length) {
      new ErrorLogDto(
        user.id,
        dtos,
        this.validateProducts.name,
        'Geçersiz ürünler',
      ).log(this.logger);
      throw new BadRequestException('Geçersiz işlem');
    }
    return productVendors;
  }
}
