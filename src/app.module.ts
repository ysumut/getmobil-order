import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_FILTER, APP_GUARD, APP_PIPE } from '@nestjs/core';
import { OrderModule } from './order/order.module';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';
import { ErrorValidationPipe } from './common/pipes/error-validation.pipe';
import { ProductModule } from './product/product.module';
import { AuthGuard } from './common/guards/auth.guard';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return [
          {
            ttl: 60000, // 60 seconds
            limit: 30,
            skipIf: () => configService.get<string>('APP_ENV') !== 'production',
          },
        ];
      },
    }),
    JwtModule.register({ global: true }),
    AuthModule,
    CommonModule,
    OrderModule,
    ProductModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_PIPE,
      useClass: ErrorValidationPipe,
    },
    {
      provide: APP_FILTER,
      useClass: PrismaExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
