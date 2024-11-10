import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsObject, Min } from 'class-validator';

export class CreateInvoiceDto {
  @ApiProperty({ type: Number })
  @IsNumber()
  orderId: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  @Min(0)
  totalAmount: number;

  @ApiProperty({ type: Object })
  @IsObject()
  payload: object;
}
