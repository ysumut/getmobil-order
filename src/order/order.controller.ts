import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Post, Query } from '@nestjs/common';
import { OrderService } from './order.service';
import { GeneralResponseDto } from '../common/dtos/general-response.dto';
import { GetOrderDetailDto } from './dtos/get-order-detail.dto';
import { OrderValidation } from './order.validation';
import { User } from '../common/decorators/auth.decorator';
import { UserDto } from '../common/dtos/user.dto';
import { CreateOrderDto } from './dtos/create-order.dto';

@ApiTags('Orders')
@Controller('orders')
export class OrderController {
  constructor(
    private orderValidation: OrderValidation,
    private orderService: OrderService,
  ) {}

  @Get()
  @ApiBearerAuth()
  @ApiOkResponse({ type: GeneralResponseDto })
  async getOrders(@User() user: UserDto): Promise<GeneralResponseDto> {
    const orders = await this.orderService.getOrders(user);
    return new GeneralResponseDto().setData(orders);
  }

  @Get('detail')
  @ApiBearerAuth()
  @ApiOkResponse({ type: GeneralResponseDto })
  async getOrderDetail(
    @User() user: UserDto,
    @Query() dto: GetOrderDetailDto,
  ): Promise<GeneralResponseDto> {
    const order = await this.orderService.getOrderDetail(user, dto);
    return new GeneralResponseDto().setData(order);
  }

  @Post()
  @ApiBearerAuth()
  @ApiOkResponse({ type: GeneralResponseDto })
  async createOrder(
    @User() user: UserDto,
    @Query() dtos: CreateOrderDto[],
  ): Promise<GeneralResponseDto> {
    await this.orderValidation.validateCreateOrder(user, dtos);
    const order = await this.orderService.createOrder(user, dtos);
    return new GeneralResponseDto().setData(order);
  }
}
