import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserEntity } from '../../entities/user.entity';

@ApiTags('认证模块')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @ApiOperation({ summary: '用户登录' })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
   
  async login(@Body() loginDto: LoginDto, @Req() req: any) {
    const result = await this.authService.login(req.user);
    return {
      token: result.access_token,
      refreshToken: result.refresh_token,
    };
  }

  @ApiOperation({ summary: '用户注册' })
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @ApiOperation({ summary: '获取用户信息' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('getUserInfo')
  getUserInfo(@CurrentUser() user: UserEntity) {
    return this.authService.getUserInfo(user);
  }

  @ApiOperation({ summary: '获取用户信息 (profile)' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@CurrentUser() user: UserEntity) {
    return user;
  }

  @ApiOperation({ summary: '退出登录' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout() {
    return { message: '退出成功' };
  }

  @ApiOperation({ summary: '刷新 Token' })
  @Post('refreshToken')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body('refreshToken') refreshToken: string) {
    const result = await this.authService.refreshToken(refreshToken);
    return {
      token: result.access_token,
      refreshToken: result.refresh_token,
    };
  }
}
