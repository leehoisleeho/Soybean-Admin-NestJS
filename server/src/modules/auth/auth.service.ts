import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { UserEntity } from '../../entities/user.entity';
import { RegisterDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) { }

  /**
   * 验证用户
   */
  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .leftJoinAndSelect('user.roles', 'roles')
      .where('user.username = :username', { username })
      .getOne();

    if (user && (await bcrypt.compare(pass, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  /**
   * 登录
   */
   
  async login(user: any) {
     
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.generateRefreshToken(payload),
    };
  }

  /**
   * 注册
   */
  async register(registerDto: RegisterDto) {
     
    const { username, password, nickname } = registerDto;

     
    const existingUser = await this.userRepository.findOne({ where: { username } });
    if (existingUser) {
      throw new ConflictException('用户名已存在');
    }

     
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
       
      username,
      password: hashedPassword,
       
      nickname,
    });

    await this.userRepository.save(user);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...result } = user;
    return result;
  }

  /**
   * 刷新 Token
   */
  async refreshToken(refreshTokenValue: string) {
    const payload = this.verifyRefreshToken(refreshTokenValue);
    if (!payload) {
      throw new UnauthorizedException('Refresh Token 无效或已过期');
    }

    // 验证用户是否仍然存在且有效
    const user = await this.findUserById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('用户不存在');
    }
    if (user.status === 0) {
      throw new UnauthorizedException('用户已被禁用');
    }

    const newPayload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(newPayload),
      refresh_token: this.generateRefreshToken(newPayload),
    };
  }

  /**
   * 生成 Refresh Token
   */
  private generateRefreshToken(payload: { username: string; sub: string }): string {
    const secret = this.configService.get<string>('JWT_REFRESH_SECRET') || 'soybean_admin_refresh_secret';
    const expiresIn = this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') || '30d';
    return this.jwtService.sign(payload, { secret, expiresIn: expiresIn as any });
  }

  /**
   * 验证 Refresh Token
   */
  private verifyRefreshToken(token: string): { username: string; sub: string } | null {
    try {
      const secret = this.configService.get<string>('JWT_REFRESH_SECRET') || 'soybean_admin_refresh_secret';
      const decoded = this.jwtService.verify<{ username: string; sub: string }>(token, { secret });
      return decoded;
    } catch {
      return null;
    }
  }

  /**
   * 根据 ID 获取用户信息
   */
  async findUserById(id: string) {
    return this.userRepository.findOne({
      where: { id },
      relations: ['roles', 'roles.menus'],
    });
  }

  /**
   * 获取格式化的用户信息（前端使用）
   * 直接从已加载的 user 对象提取，避免重复查询数据库
   */
  getUserInfo(user: UserEntity) {
    if (!user) return null;

    const roles = user.roles?.map((role) => role.code) ?? [];
    const buttons: string[] = [];
    user.roles?.forEach((role) => {
      role.menus?.forEach((menu) => {
        if (menu.type === 3 && menu.permission) {
          buttons.push(menu.permission);
        }
      });
    });

    return {
      userId: user.id,
      userName: user.username,
      roles,
      buttons: Array.from(new Set(buttons)),
    };
  }
}
