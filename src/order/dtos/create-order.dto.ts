import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({ type: Number })
  @IsNumber()
  vendorId: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  productId: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  @Min(1)
  quantity: number;
}
