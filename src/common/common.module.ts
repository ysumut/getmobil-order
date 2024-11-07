import { Module } from '@nestjs/common';
import { PrismaService } from './services/prisma.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class CommonModule {}
