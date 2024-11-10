import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CommonModule } from '../common/common.module';
import { AuthValidation } from './auth.validation';

@Module({
  imports: [CommonModule],
  controllers: [AuthController],
  providers: [AuthService, AuthValidation],
  exports: [],
})
export class AuthModule {}
