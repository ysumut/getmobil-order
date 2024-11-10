import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { User, Public } from '../common/decorators/auth.decorator';
import { GeneralResponseDto } from '../common/dtos/general-response.dto';
import { UserDto } from '../common/dtos/user.dto';
import { AuthValidation } from './auth.validation';
import { LoginDto } from './dtos/login.dto';
import { SignUpDto } from './dtos/sign-up.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private authValidation: AuthValidation,
  ) {}

  @Get('profile')
  @ApiBearerAuth()
  @ApiOkResponse({ type: GeneralResponseDto })
  async getUserProfile(@User() user: UserDto) {
    const profile = await this.authService.getUserProfile(user);
    return new GeneralResponseDto().setData(profile);
  }

  @Post('login')
  @Public()
  async login(@Body() dto: LoginDto): Promise<GeneralResponseDto> {
    const profile = await this.authService.login(dto);
    return new GeneralResponseDto().setData(profile);
  }

  @Post('sign-up')
  @Public()
  async signUp(@Body() dto: SignUpDto): Promise<GeneralResponseDto> {
    await this.authValidation.signUp(dto);
    await this.authService.signUp(dto);
    return new GeneralResponseDto();
  }
}
