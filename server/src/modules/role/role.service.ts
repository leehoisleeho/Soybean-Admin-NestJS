import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In, Not } from 'typeorm';
import { RoleEntity } from '../../entities/role.entity';
import { MenuEntity } from '../../entities/menu.entity';
import { UserEntity } from '../../entities/user.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto, AssignMenusDto } from './dto/update-role.dto';
import { QueryRoleDto } from './dto/query-role.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
    @InjectRepository(MenuEntity)
    private readonly menuRepository: Repository<MenuEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  /**
   * 创建角色
   */
  async create(createRoleDto: CreateRoleDto) {
    const { code } = createRoleDto;
    const existingRole = await this.roleRepository.findOne({ where: { code } });
    if (existingRole) {
      throw new ConflictException('角色编码已存在');
    }

    const role = this.roleRepository.create(createRoleDto);
    return this.roleRepository.save(role);
  }

  /**
   * 获取角色列表
   */
  async findAll(queryRoleDto: QueryRoleDto) {
    const { page = 1, pageSize = 10, name, code, status } = queryRoleDto;

    const where: any = {};
    if (name) where.name = Like(`%${name}%`);
    if (code) where.code = Like(`%${code}%`);
    if (status !== undefined) where.status = status;

    const [records, total] = await this.roleRepository.findAndCount({
      where,
      order: { sort: 'ASC', createdAt: 'DESC' },
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
   * 获取角色详情
   */
  async findOne(id: string) {
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: ['menus'],
    });
    if (!role) {
      throw new NotFoundException('角色不存在');
    }
    return role;
  }

  /**
   * 更新角色
   */
  async update(id: string, updateRoleDto: UpdateRoleDto) {
    const role = await this.findOne(id);
    const { code } = updateRoleDto;

    if (code && code !== role.code) {
      const existingRole = await this.roleRepository.findOne({
        where: { code, id: Not(id) },
      });
      if (existingRole) {
        throw new ConflictException('角色编码已存在');
      }
    }

    Object.assign(role, updateRoleDto);
    return this.roleRepository.save(role);
  }

  /**
   * 删除角色
   */
  async remove(id: string) {
    const role = await this.findOne(id);
    await this.checkRoleHasUsers(id);
    return this.roleRepository.softRemove(role);
  }

  /**
   * 批量删除角色
   */
  async removeMany(ids: string[]) {
    const roles = await this.roleRepository.findBy({ id: In(ids) });
    if (roles.length === 0) {
      throw new NotFoundException('未找到要删除的角色');
    }
    for (const id of ids) {
      await this.checkRoleHasUsers(id);
    }
    return this.roleRepository.softRemove(roles);
  }

  /**
   * 分配菜单权限
   */
  async assignMenus(id: string, assignMenusDto: AssignMenusDto) {
    const role = await this.findOne(id);
    const menuIds = Array.isArray(assignMenusDto.menuIds) ? assignMenusDto.menuIds : [];

    if (menuIds.length === 0) {
      role.menus = [];
      return this.roleRepository.save(role);
    }

    const resolvedMenuIds = await this.resolveMenuIdsWithAncestors(menuIds);
    const menus = await this.menuRepository.findBy({ id: In(resolvedMenuIds) });
    role.menus = menus;
    return this.roleRepository.save(role);
  }

  private async resolveMenuIdsWithAncestors(menuIds: string[]): Promise<string[]> {
    const resolvedIds = new Set<string>();
    const pendingIds = new Set<string>(menuIds);

    while (pendingIds.size) {
      const idsToFetch = Array.from(pendingIds);
      pendingIds.clear();

      idsToFetch.forEach(id => resolvedIds.add(id));

      const menus = await this.menuRepository.findBy({ id: In(idsToFetch) });

      menus.forEach(menu => {
        if (menu.parentId && !resolvedIds.has(menu.parentId)) {
          pendingIds.add(menu.parentId);
        }
      });
    }

    return Array.from(resolvedIds);
  }

  /**
   * 获取角色的菜单权限
   */
  async findRoleMenus(id: string) {
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: ['menus'],
    });
    if (!role) {
      throw new NotFoundException('角色不存在');
    }
    return role.menus;
  }

  /**
   * 检查角色是否有关联用户
   */
  private async checkRoleHasUsers(roleId: string): Promise<void> {
    const count = await this.userRepository
      .createQueryBuilder('user')
      .innerJoin('user.roles', 'role', 'role.id = :roleId', { roleId })
      .getCount();
    if (count > 0) {
      throw new BadRequestException(`该角色下有 ${count} 个关联用户，请先解除关联后再删除`);
    }
  }
}
