import { UserDto } from '../../common/dtos/user.dto';
import { CreateOrderDto } from './create-order.dto';
import { ProductVendor } from '@prisma/client';

export class CreateOrderKafkaDto {
  user: UserDto;
  orderDtos: CreateOrderDto[];
  productVendors: ProductVendor[];
}
