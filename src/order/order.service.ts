import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { GetOrderDetailDto } from './dtos/get-order-detail.dto';
import { CreateOrderDto } from './dtos/create-order.dto';
import { UserDto } from '../common/dtos/user.dto';
import { ProductVendor } from '@prisma/client';
import { ProductService } from '../product/product.service';

@Injectable()
export class OrderService {
  constructor(
    private prismaService: PrismaService,
    private productService: ProductService,
  ) {}

  async getOrders(user: UserDto) {
    const orders = await this.prismaService.order.findMany({
      select: { id: true, totalAmount: true, createdAt: true, updatedAt: true },
      where: { userId: user.id },
    });
    return orders;
  }

  async getOrderDetail(user: UserDto, dto: GetOrderDetailDto) {
    const order = await this.prismaService.order.findFirstOrThrow({
      select: {
        id: true,
        totalAmount: true,
        createdAt: true,
        updatedAt: true,
        orderItems: {
          select: {
            quantity: true,
            vendor: { select: { id: true, name: true } },
            product: { select: { id: true, name: true } },
            createdAt: true,
            updatedAt: true,
          },
        },
      },
      where: { id: dto.id, userId: user.id },
    });
    return order;
  }

  async createOrder(
    user: UserDto,
    dtos: CreateOrderDto[],
    productVendors: ProductVendor[],
  ): Promise<void> {
    let totalAmount = 0;
    for (const productVendor of productVendors) {
      const realPrice = this.productService.getRealPrice(
        productVendor.price,
        productVendor.taxRate,
        productVendor.discountRate,
      );
      productVendor['decrement'] = dtos.find(
        (dto) =>
          dto.productId == productVendor.productId &&
          dto.vendorId == productVendor.vendorId,
      ).quantity;
      totalAmount += realPrice * productVendor['decrement'];
    }
    await this.prismaService.$transaction(async (tx) => {
      await tx.order.create({
        data: {
          userId: user.id,
          totalAmount: totalAmount,
          orderItems: {
            createMany: {
              data: dtos.map((dto) => {
                return {
                  productId: dto.productId,
                  vendorId: dto.vendorId,
                  quantity: dto.quantity,
                };
              }),
            },
          },
        },
      });
      for (const productVendor of productVendors) {
        await tx.productVendor.update({
          where: { id: productVendor.id },
          data: { quantity: { decrement: productVendor['decrement'] } },
        });
      }
    });
  }
}
