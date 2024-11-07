import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { GetOrderDetailDto } from './dtos/get-order-detail.dto';

@Injectable()
export class OrderService {
  constructor(private prismaService: PrismaService) {}

  async getOrders() {
    const orders = await this.prismaService.order.findMany();
    return orders;
  }

  async getOrderDetail(dto: GetOrderDetailDto) {
    const order = await this.prismaService.order.findFirstOrThrow({
      where: { id: dto.id },
      include: { orderItems: true },
    });
    return order;
  }
}
