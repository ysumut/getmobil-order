import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Query } from '@nestjs/common';
import { OrderService } from './order.service';
import { GeneralResponseDto } from '../common/dtos/general-response.dto';
import { GetOrderDetailDto } from './dtos/get-order-detail.dto';

@ApiTags('Orders')
@Controller('orders')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Get()
  @ApiOkResponse({ type: GeneralResponseDto })
  async getOrders(): Promise<GeneralResponseDto> {
    const orders = await this.orderService.getOrders();
    return new GeneralResponseDto().setData(orders);
  }

  @Get('detail')
  @ApiOkResponse({ type: GeneralResponseDto })
  async getOrderDetail(
    @Query() dto: GetOrderDetailDto,
  ): Promise<GeneralResponseDto> {
    const order = await this.orderService.getOrderDetail(dto);
    return new GeneralResponseDto().setData(order);
  }
}
