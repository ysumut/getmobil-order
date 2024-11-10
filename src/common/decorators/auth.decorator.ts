import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';
import { UserDto } from '../dtos/user.dto';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserDto => {
    const request = ctx.switchToHttp().getRequest();
    return {
      id: request.user.id,
      fullName: request.user.fullName,
      email: request.user.email,
    };
  },
);
