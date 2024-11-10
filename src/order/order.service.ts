import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { GetOrderDetailDto } from './dtos/get-order-detail.dto';
import { CreateOrderDto } from './dtos/create-order.dto';
import { UserDto } from '../common/dtos/user.dto';

@Injectable()
export class OrderService {
  constructor(private prismaService: PrismaService) {}

  async getOrders(user: UserDto) {
    const orders = await this.prismaService.order.findMany({
      where: { userId: user.id },
    });
    return orders;
  }

  async getOrderDetail(user: UserDto, dto: GetOrderDetailDto) {
    const order = await this.prismaService.order.findFirstOrThrow({
      where: { id: dto.id, userId: user.id },
      include: { orderItems: true },
    });
    return order;
  }

  async createOrder(user: UserDto, dtos: CreateOrderDto[]) {
    const order = await this.prismaService.order.create({
      data: {
        userId: user.id,
        totalAmount: 0,
        orderItems: { createMany: { data: [] } },
      },
    });
    return order;
  }
}
