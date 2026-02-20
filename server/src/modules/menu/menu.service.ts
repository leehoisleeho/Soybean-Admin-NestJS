import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { MenuEntity } from '../../entities/menu.entity';
import { UserEntity } from '../../entities/user.entity';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { QueryMenuDto } from './dto/query-menu.dto';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(MenuEntity)
    private menuRepository: Repository<MenuEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) { }

  /**
   * 创建菜单
   */
  async create(createMenuDto: CreateMenuDto) {
    const menu = this.menuRepository.create(createMenuDto);
    return this.menuRepository.save(menu);
  }

  /**
   * 获取所有菜单列表（扁平）
   */
  async findAll(queryMenuDto: QueryMenuDto) {
    const { name, status } = queryMenuDto;
    const queryBuilder = this.menuRepository.createQueryBuilder('menu');

    if (name) {
      queryBuilder.andWhere('menu.name LIKE :name', { name: `%${name}%` });
    }

    if (status !== undefined) {
      queryBuilder.andWhere('menu.status = :status', { status });
    }

    const records = await queryBuilder.orderBy('menu.sort', 'ASC').getMany();
    return {
      records,
      total: records.length,
      current: 1,
      size: records.length,
    };
  }

  /**
   * 获取菜单树形结构
   */
  async getTree(queryMenuDto: QueryMenuDto) {
    const { records } = await this.findAll(queryMenuDto);
    const tree = this.buildTree(records);
    return {
      records: tree,
      total: tree.length,
      current: 1,
      size: tree.length,
    };
  }

  /**
   * 获取用户的菜单权限树
   */
  async getUserMenuTree(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['roles'] });
    if (!user) throw new NotFoundException('用户不存在');

    const isSuper = user.roles?.some(role => role.code === 'R_SUPER') ?? false;

    const menus = await this.queryUserMenus(userId, isSuper);
    const fullMenus = await this.fillAncestorMenus(menus);
    const normalizedMenus = this.normalizeMenus(fullMenus);

    const soybeanMenus = normalizedMenus.map((menu) => this.transformToSoybeanMenu(menu));
    const tree = this.buildSoybeanTree(soybeanMenus);
    return tree;
  }

  /**
   * 通用树构建方法
   * @param items 数据项数组
   * @param getId 获取项 ID 的函数
   * @param getParentId 获取项父 ID 的函数
   * @returns 树形结构数组
   */
  private buildTreeFromList<T extends Record<string, any>>(
    items: T[],
    getId: (item: T) => string | null,
    getParentId: (item: T) => string | null,
  ): T[] {
    // 构建 ID 集合，用于验证 parentId 是否有效
    const idSet = new Set<string>();
    for (const item of items) {
      const id = getId(item);
      if (id) idSet.add(id);
    }

    // 规范化 ID 和 parentId，无效的 parentId 设为 null
    const list = items.map((item) => {
      const id = getId(item);
      const parentId = getParentId(item);
      const effectiveParentId = parentId && idSet.has(parentId) ? parentId : null;
      return { ...item, id, parentId: effectiveParentId };
    });

    // 按 parentId 分组
    const childrenByParentId = new Map<string | null, any[]>();
    for (const item of list) {
      const key = item.parentId ?? null;
      const arr = childrenByParentId.get(key) || [];
      arr.push(item);
      childrenByParentId.set(key, arr);
    }

    // 递归附加子节点
    const attachChildren = (node: any): any => {
      const kids = childrenByParentId.get(node.id) || [];
      if (kids.length) {
        node.children = kids.map((k: any) => attachChildren(k));
      }
      return node;
    };

    // 返回根节点树
    const roots = childrenByParentId.get(null) || [];
    return roots.map((r) => attachChildren(r));
  }

  /**
   * 递归构建树形结构的递归函数
   */
  private buildTree(menus: MenuEntity[]): any[] {
    const normalizedMenus = this.normalizeMenus(menus);
    return this.buildTreeFromList(
      normalizedMenus,
      (m) => this.normalizeId(m.id),
      (m) => this.normalizeId(m.parentId),
    );
  }

  /**
   * 将菜单实体转换为 SoybeanAdmin 路由格式
   */
  private transformToSoybeanMenu(menu: MenuEntity) {
    const parentId = this.normalizeId(menu.parentId);
    const isRoot = !parentId;
    const isDirectory = menu.type === 1;

    const iconValue = this.normalizeId(menu.icon);
    const isLocalIcon = Boolean(iconValue && iconValue.startsWith('local:'));
    const icon = isLocalIcon ? undefined : iconValue || undefined;
    const localIcon = isLocalIcon ? iconValue!.slice('local:'.length) : undefined;

    const item: any = {
      id: this.normalizeId(menu.id),
      parentId,
      name: menu.path ? menu.path.replace(/\//g, '_').replace(/^_/, '') : menu.name,
      path: menu.path || '',
      meta: {
        title: menu.name,
        icon,
        localIcon,
        order: menu.sort,
        requiresAuth: true,
        hideInMenu: menu.visible === 0,
        keepAlive: true,
      },
    };

    // 设置组件
    if (isDirectory) {
      item.component = isRoot ? 'layout.base' : 'layout.blank';
    } else if (menu.component) {
      item.component = menu.component;
    }

    if (menu.redirect) {
      item.redirect = menu.redirect;
    }

    return item;
  }

  /**
   * 构建 SoybeanAdmin 树形结构
   */
  private buildSoybeanTree(menus: any[]): any[] {
    return this.buildTreeFromList(
      menus,
      (m) => (m?.id ? String(m.id).trim() : null),
      (m) => (m?.parentId ? String(m.parentId).trim() : null),
    );
  }

  private normalizeId(value: string | null | undefined): string | null {
    if (value === null || value === undefined) return null;
    const trimmed = String(value).trim();
    return trimmed ? trimmed : null;
  }

  private normalizeMenus(menus: MenuEntity[]): MenuEntity[] {
    return menus.map((m) => {
      const cloned: any = { ...m };
      cloned.id = this.normalizeId(m.id);
      cloned.parentId = this.normalizeId(m.parentId);
      return cloned as MenuEntity;
    });
  }

  private async queryUserMenus(userId: string, isSuper: boolean): Promise<MenuEntity[]> {
    if (isSuper) {
      return this.menuRepository
        .createQueryBuilder('menu')
        .where('menu.status = :status', { status: 1 })
        .andWhere('menu.type != :buttonType', { buttonType: 3 })
        .orderBy('menu.sort', 'ASC')
        .addOrderBy('menu.createdAt', 'DESC')
        .getMany();
    }

    const records = await this.menuRepository
      .createQueryBuilder('menu')
      .distinct(true)
      .innerJoin('sys_role_menu', 'rm', 'rm.menu_id = menu.id')
      .innerJoin('sys_user_role', 'ur', 'ur.role_id = rm.role_id AND ur.user_id = :userId', { userId })
      .where('menu.status = :status', { status: 1 })
      .andWhere('menu.type != :buttonType', { buttonType: 3 })
      .orderBy('menu.sort', 'ASC')
      .addOrderBy('menu.createdAt', 'DESC')
      .getMany();

    if (records.length) return records;

    const homeMenu = await this.menuRepository.findOne({
      where: { path: '/home', status: 1 },
    });

    return homeMenu && homeMenu.type !== 3 ? [homeMenu] : [];
  }

  private async fillAncestorMenus(menus: MenuEntity[]): Promise<MenuEntity[]> {
    const map = new Map<string, MenuEntity>();
    const normalized = this.normalizeMenus(menus);
    normalized.forEach((m) => {
      if (m.id) map.set(m.id, m);
    });

    let pendingParentIds = Array.from(
      new Set(
        normalized
          .map((m) => this.normalizeId(m.parentId))
          .filter((pid): pid is string => typeof pid === 'string' && pid.length > 0 && !map.has(pid)),
      ),
    );

    while (pendingParentIds.length) {
      const parentIds = pendingParentIds.slice(0, 200);
      pendingParentIds = pendingParentIds.slice(200);

      const parents = await this.menuRepository.findBy({ id: In(parentIds) });
      const normalizedParents = this.normalizeMenus(parents);
      normalizedParents.forEach((p) => {
        if (p.id && !map.has(p.id)) map.set(p.id, p);
      });

      const newParentIds = normalizedParents
        .map((p) => this.normalizeId(p.parentId))
        .filter((pid): pid is string => typeof pid === 'string' && pid.length > 0 && !map.has(pid));

      pendingParentIds = Array.from(new Set([...pendingParentIds, ...newParentIds]));
    }

    return Array.from(map.values()).sort((a, b) => (a.sort || 0) - (b.sort || 0));
  }

  /**
   * 获取菜单详情
   */
  async findOne(id: string) {
    const menu = await this.menuRepository.findOne({ where: { id } });
    if (!menu) {
      throw new NotFoundException('菜单不存在');
    }
    return menu;
  }

  /**
   * 更新菜单
   */
  async update(id: string, updateMenuDto: UpdateMenuDto) {
    const menu = await this.findOne(id);
    Object.assign(menu, updateMenuDto);
    return this.menuRepository.save(menu);
  }

  /**
   * 删除菜单
   */
  async remove(id: string) {
    const menu = await this.findOne(id);
    const hasChildren = await this.menuRepository.findOne({ where: { parentId: id } });
    if (hasChildren) {
      throw new Error('请先删除子菜单');
    }
    return this.menuRepository.remove(menu);
  }

  /**
   * 批量删除菜单
   */
  async removeMany(ids: string[]) {
    const menus = await this.menuRepository.findBy({ id: In(ids) });
    if (menus.length === 0) {
      throw new NotFoundException('未找到要删除的菜单');
    }
    // Check if any of these menus have children that are NOT in the ids list
    for (const id of ids) {
      const hasChildren = await this.menuRepository.findOne({ where: { parentId: id } });
      if (hasChildren && !ids.includes(hasChildren.id)) {
        throw new Error(`菜单 ${id} 含有子菜单，请先删除子菜单`);
      }
    }
    return this.menuRepository.remove(menus);
  }
}
