import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_FILTER, APP_GUARD, APP_PIPE } from '@nestjs/core';
import { OrderModule } from './order/order.module';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';
import { ErrorValidationPipe } from './common/pipes/error-validation.pipe';

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
    CommonModule,
    OrderModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_PIPE,
      useClass: ErrorValidationPipe,
    },
    {
      provide: APP_FILTER,
      useClass: PrismaExceptionFilter,
    },
  ],
})
export class AppModule {}
