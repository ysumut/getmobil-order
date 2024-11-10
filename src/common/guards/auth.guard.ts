import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  Scope,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/auth.decorator';
import { PrismaService } from '../services/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AccessTokenPayloadDto } from '../decorators/access-token-payload.dto';
import { mainDirectory } from '../../main';
import { fsReadFile } from 'ts-loader/dist/utils';

@Injectable({ scope: Scope.REQUEST })
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get<boolean>(
      IS_PUBLIC_KEY,
      ctx.getHandler(),
    );
    if (isPublic) {
      return true;
    }
    try {
      const request = ctx.switchToHttp().getRequest();
      const authorization = request.headers.authorization;
      if (!authorization) {
        throw new HttpException('unauthenticated', HttpStatus.UNAUTHORIZED);
      }
      const authorizationArr = authorization.split('Bearer ');
      const accessToken =
        authorizationArr.length == 1
          ? String(authorizationArr[0])
          : String(authorizationArr[1]);
      const payload: AccessTokenPayloadDto = this.jwtService.verify(
        accessToken,
        {
          publicKey: fsReadFile(mainDirectory + '/.oauth/public.key'),
        },
      );
      const user = await this.prismaService.user.findFirstOrThrow({
        where: { id: payload.userId },
      });
      request.user = user;
      return true;
    } catch {
      throw new HttpException('Giriş yapınız', HttpStatus.UNAUTHORIZED);
    }
  }
}
