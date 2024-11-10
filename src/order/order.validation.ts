import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { CreateOrderDto } from './dtos/create-order.dto';
import { ProductValidation } from '../product/product.validation';
import { UserDto } from '../common/dtos/user.dto';
import { ErrorLogDto } from '../common/dtos/error-log.dto';

@Injectable()
export class OrderValidation {
  private readonly logger = new Logger(OrderValidation.name);

  constructor(
    private prismaService: PrismaService,
    private productValidation: ProductValidation,
  ) {}

  async validateCreateOrder(user: UserDto, dtos: CreateOrderDto[]) {
    if (dtos.length == 0) {
      new ErrorLogDto(
        user.id,
        dtos,
        this.validateCreateOrder.name,
        'Sipariş sayısı: 0',
      ).log(this.logger);
      throw new BadRequestException('Sipariş sayısı 0 olamaz');
    }
    const vendorIds = dtos.map((dto) => dto.vendorId);
    const vendorCount = await this.prismaService.vendor.count({
      where: { id: { in: [...new Set(vendorIds)] } },
    });
    if (vendorIds.length !== vendorCount) {
      new ErrorLogDto(
        user.id,
        dtos,
        this.validateCreateOrder.name,
        'Geçersiz satıcılar',
      ).log(this.logger);
      throw new BadRequestException('Geçersiz işlem');
    }
    return await this.productValidation.validateProducts(user, dtos);
  }
}
