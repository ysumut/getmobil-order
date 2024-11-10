import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { SignUpDto } from './dtos/sign-up.dto';

@Injectable()
export class AuthValidation {
  constructor(private prismaService: PrismaService) {}

  async signUp(dto: SignUpDto): Promise<void> {
    const emailExist = await this.prismaService.user.findFirst({
      where: { email: dto.email },
    });
    if (emailExist) {
      throw new BadRequestException('E-mail adresi kullanılmaktadır.');
    }
  }
}
