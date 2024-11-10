import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class LoginDto {
  @ApiProperty({ type: String })
  @IsString()
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @ApiProperty({ type: String })
  @IsString()
  password: string;
}
