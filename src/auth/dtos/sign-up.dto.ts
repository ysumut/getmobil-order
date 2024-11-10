import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class SignUpDto {
  @ApiProperty({ type: String })
  @IsString()
  @MinLength(1)
  fullName: string;

  @ApiProperty({ type: String })
  @IsEmail()
  @MinLength(1)
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @ApiProperty({ type: String })
  @IsString()
  @MinLength(6)
  @MaxLength(32)
  password: string;
}
