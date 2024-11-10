import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { UserDto } from '../common/dtos/user.dto';
import { LoginDto } from './dtos/login.dto';
import * as bcrypt from 'bcrypt';
import { SignUpDto } from './dtos/sign-up.dto';
import { JwtService } from '@nestjs/jwt';
import { AccessTokenPayloadDto } from '../common/decorators/access-token-payload.dto';
import { fsReadFile } from 'ts-loader/dist/utils';
import { mainDirectory } from '../main';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async getUserProfile(user: UserDto) {
    const profile = await this.prismaService.user.findFirstOrThrow({
      where: { id: user.id },
    });
    return {
      id: profile.id,
      fullName: profile.fullName,
      email: profile.email,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prismaService.user.findFirst({
      where: { email: dto.email },
    });
    if (!user) {
      throw new BadRequestException('E-mail veya şifre yanlış.');
    }
    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw new BadRequestException('E-mail veya şifre yanlış.');
    }
    const accessToken = this.jwtService.sign(
      {
        userId: user.id,
      } as AccessTokenPayloadDto,
      {
        privateKey: fsReadFile(mainDirectory + '/.oauth/private.key'),
        algorithm: 'RS256',
      },
    );
    return { accessToken: accessToken };
  }

  async signUp(dto: SignUpDto): Promise<void> {
    const hash = await bcrypt.hash(dto.password, 10);
    await this.prismaService.user.create({
      data: {
        fullName: dto.fullName,
        email: dto.email,
        password: hash,
      },
    });
  }
}
