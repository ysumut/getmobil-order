import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsOptional } from 'class-validator';

export class GeneralResponseDto<T = unknown> {
  @ApiProperty({ type: Boolean, default: true, required: true })
  @IsBoolean()
  status: boolean;

  @ApiProperty({ type: Object, isArray: true, required: false })
  @IsArray()
  @IsOptional()
  data?: T | T[];

  @ApiProperty({ type: String, isArray: true, required: false })
  @IsArray()
  @IsOptional()
  messages?: string[];

  constructor(status = true) {
    this.status = status;
  }

  setData(data?: T | T[]) {
    if (!data) {
      return this;
    }
    if (Array.isArray(data)) {
      this.data = data.filter((d) => d);
    } else {
      this.data = data;
    }
    return this;
  }

  setMessages(messages?: string[]) {
    if (!messages) {
      return this;
    }
    if (messages.length > 0) {
      this.messages = messages;
    }
    return this;
  }
}
