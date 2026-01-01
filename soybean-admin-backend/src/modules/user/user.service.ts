import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { UserEntity } from '../../entities/user.entity';
import { RoleEntity } from '../../entities/role.entity';
import { CreateUserDto } from './dto/create-user.dto';
import {
  UpdateUserDto,
  UpdateStatusDto,
  ResetPasswordDto,
  AssignRolesDto,
} from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
     
  ) { }

  /**
   * 创建用户
   */
  async create(createUserDto: CreateUserDto) {
    const { username, password, roleIds, ...rest } = createUserDto;

    const existingUser = await this.userRepository.findOne({
      where: { username },
    });
    if (existingUser) {
      throw new ConflictException('用户名已存在');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
      ...rest,
      username,
      password: hashedPassword,
    });

    if (roleIds && roleIds.length > 0) {
      const roles = await this.roleRepository.findBy({ id: In(roleIds) });
      user.roles = roles;
    }

    return this.userRepository.save(user);
  }

  /**
   * 获取用户列表（分页、搜索、筛选）
   */
  async findAll(queryUserDto: QueryUserDto) {
     
    const { page = 1, pageSize = 10, username, nickname, email, phone, status } = queryUserDto;

    const where: any = {};
     
    if (username) where.username = Like(`%${username}%`);
     
    if (nickname) where.nickname = Like(`%${nickname}%`);
     
    if (email) where.email = Like(`%${email}%`);
     
    if (phone) where.phone = Like(`%${phone}%`);
     
    if (status !== undefined) where.status = status;

    const [records, total] = await this.userRepository.findAndCount({
       
      where,
      relations: ['roles'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return {
      records,
      total,
      current: page,
      size: pageSize,
    };
  }

  /**
   * 获取用户详情
   */
  async findOne(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['roles'],
    });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }
    return user;
  }

  /**
   * 更新用户信息
   */
  async update(id: string, updateUserDto: UpdateUserDto) {
    const { roleIds, ...rest } = updateUserDto;
    const user = await this.findOne(id);

    if (roleIds) {
      const roles = await this.roleRepository.findBy({ id: In(roleIds) });
      user.roles = roles;
    }

    Object.assign(user, rest);
    return this.userRepository.save(user);
  }

  /**
   * 删除用户（软删除）
   */
  async remove(id: string) {
    const user = await this.findOne(id);
    return this.userRepository.softRemove(user);
  }

  /**
   * 批量删除用户
   */
  async removeMany(ids: string[]) {
    const users = await this.userRepository.findBy({ id: In(ids) });
    if (users.length === 0) {
      throw new NotFoundException('未找到要删除的用户');
    }
    return this.userRepository.softRemove(users);
  }

  /**
   * 更新用户状态
   */
  async updateStatus(id: string, updateStatusDto: UpdateStatusDto) {
    const user = await this.findOne(id);
    user.status = updateStatusDto.status;
    return this.userRepository.save(user);
  }

  /**
   * 重置密码
   */
  async resetPassword(id: string, resetPasswordDto: ResetPasswordDto) {
    const user = await this.findOne(id);
    user.password = await bcrypt.hash(resetPasswordDto.password, 10);
    return this.userRepository.save(user);
  }

  /**
   * 分配角色
   */
  async assignRoles(id: string, assignRolesDto: AssignRolesDto) {
    const user = await this.findOne(id);
    const roles = await this.roleRepository.findBy({
      id: In(assignRolesDto.roleIds),
    });
    user.roles = roles;
    return this.userRepository.save(user);
  }
}
