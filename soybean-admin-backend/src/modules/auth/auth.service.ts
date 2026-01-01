import { Injectable, ConflictException } from '@nestjs/common';
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
     
  ) { }

  /**
   * 验证用户
   */
  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { username },
      relations: ['roles'],
    });

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
       
      user: user,
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
  refreshToken(user: any) {
     
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
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
   */
  async getUserInfo(userId: string) {
    const user = await this.findUserById(userId);
    if (!user) return null;

    const roles = user.roles.map((role) => role.code);
    const buttons: string[] = [];
    user.roles.forEach((role) => {
      role.menus.forEach((menu) => {
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
