import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        configService.get<string>('JWT_SECRET') || 'soybean_admin_secret',
    });
  }

  async validate(payload: any) {
     
    const user = await this.authService.findUserById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('用户不存在或已注销');
    }
    if (user.status === 0) {
      throw new UnauthorizedException('用户已被禁用');
    }
    return user;
  }
}
