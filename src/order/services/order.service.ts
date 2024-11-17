import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';
import { GetOrderDetailDto } from '../dtos/get-order-detail.dto';
import { UserDto } from '../../common/dtos/user.dto';
import { ProductService } from '../../product/product.service';
import { OrderFetchService } from './order-fetch.service';
import { CreateOrderKafkaDto } from '../dtos/create-order-kafka.dto';
import { KafkaConsumerService } from '../../kafka/services/kafka-consumer.service';

@Injectable()
export class OrderService implements OnModuleInit {
  private readonly logger = new Logger(OrderService.name);

  constructor(
    private prismaService: PrismaService,
    private orderFetchService: OrderFetchService,
    private productService: ProductService,
    private kafkaConsumerService: KafkaConsumerService,
  ) {}

  async onModuleInit() {
    await this.kafkaConsumerService.consume(
      { topics: ['order.create'] },
      {
        eachMessage: async ({ topic, partition, message }) => {
          const dto: CreateOrderKafkaDto = JSON.parse(message.value.toString());
          await this.createOrder(dto);
        },
      },
    );
  }

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

  async createOrder(dto: CreateOrderKafkaDto): Promise<void> {
    let totalAmount = 0;
    for (const productVendor of dto.productVendors) {
      const realPrice = this.productService.getRealPrice(
        productVendor.price,
        productVendor.taxRate,
        productVendor.discountRate,
      );
      productVendor['decrement'] = dto.orderDtos.find(
        (dto) =>
          dto.productId == productVendor.productId &&
          dto.vendorId == productVendor.vendorId,
      ).quantity;
      totalAmount += realPrice * productVendor['decrement'];
    }
    await this.prismaService.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          userId: dto.user.id,
          totalAmount: totalAmount,
          orderItems: {
            createMany: {
              data: dto.orderDtos.map((dto) => {
                return {
                  productId: dto.productId,
                  vendorId: dto.vendorId,
                  quantity: dto.quantity,
                };
              }),
            },
          },
        },
        include: { orderItems: true },
      });
      for (const productVendor of dto.productVendors) {
        await tx.productVendor.update({
          where: { id: productVendor.id },
          data: { quantity: { decrement: productVendor['decrement'] } },
        });
      }
      await this.orderFetchService.createInvoice(
        dto.user,
        {
          orderId: order.id,
          totalAmount: order.totalAmount,
          payload: order,
        },
        dto.user.accessToken,
      );
    });
  }
}
