import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetOrderDetailDto {
  @ApiProperty({ type: Number })
  @Transform(({ value }) => +value)
  @IsNumber()
  id: number;
}
