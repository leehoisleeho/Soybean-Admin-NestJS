"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const menu_entity_1 = require("../../entities/menu.entity");
const user_entity_1 = require("../../entities/user.entity");
let MenuService = class MenuService {
    menuRepository;
    userRepository;
    constructor(menuRepository, userRepository) {
        this.menuRepository = menuRepository;
        this.userRepository = userRepository;
    }
    async create(createMenuDto) {
        const menu = this.menuRepository.create(createMenuDto);
        return this.menuRepository.save(menu);
    }
    async findAll(queryMenuDto) {
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
    async getTree(queryMenuDto) {
        const { records } = await this.findAll(queryMenuDto);
        const tree = this.buildTree(records);
        return {
            records: tree,
            total: tree.length,
            current: 1,
            size: tree.length,
        };
    }
    async getUserMenuTree(userId) {
        const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['roles'] });
        if (!user)
            throw new common_1.NotFoundException('用户不存在');
        const isSuper = user.roles?.some(role => role.code === 'R_SUPER') ?? false;
        const menus = await this.queryUserMenus(userId, isSuper);
        const fullMenus = await this.fillAncestorMenus(menus);
        const normalizedMenus = this.normalizeMenus(fullMenus);
        const soybeanMenus = normalizedMenus.map((menu) => this.transformToSoybeanMenu(menu));
        const tree = this.buildSoybeanTree(soybeanMenus);
        return tree;
    }
    buildTree(menus) {
        const normalizedMenus = this.normalizeMenus(menus);
        const idSet = new Set(normalizedMenus.map((m) => m.id));
        const list = normalizedMenus.map((m) => {
            const parentId = this.normalizeId(m.parentId);
            const effectiveParentId = parentId && idSet.has(parentId) ? parentId : null;
            return { ...m, parentId: effectiveParentId };
        });
        const childrenByParentId = new Map();
        for (const menu of list) {
            const key = menu.parentId ?? null;
            const arr = childrenByParentId.get(key) || [];
            arr.push(menu);
            childrenByParentId.set(key, arr);
        }
        const attachChildren = (node) => {
            const kids = childrenByParentId.get(node.id) || [];
            if (kids.length) {
                node.children = kids.map((k) => attachChildren(k));
            }
            return node;
        };
        const roots = childrenByParentId.get(null) || [];
        return roots.map((r) => attachChildren(r));
    }
    transformToSoybeanMenu(menu) {
        const parentId = this.normalizeId(menu.parentId);
        const isRoot = !parentId;
        const isDirectory = menu.type === 1;
        const iconValue = this.normalizeId(menu.icon);
        const isLocalIcon = Boolean(iconValue && iconValue.startsWith('local:'));
        const icon = isLocalIcon ? undefined : iconValue || undefined;
        const localIcon = isLocalIcon ? iconValue.slice('local:'.length) : undefined;
        const item = {
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
        if (isDirectory) {
            item.component = isRoot ? 'layout.base' : 'layout.blank';
        }
        else if (menu.component) {
            item.component = menu.component;
        }
        if (menu.redirect) {
            item.redirect = menu.redirect;
        }
        return item;
    }
    buildSoybeanTree(menus) {
        const idSet = new Set();
        for (const menu of menus) {
            if (menu?.id)
                idSet.add(String(menu.id).trim());
        }
        const list = menus.map((m) => {
            const id = m?.id ? String(m.id).trim() : m.id;
            const parentId = m?.parentId ? String(m.parentId).trim() : null;
            const effectiveParentId = parentId && idSet.has(parentId) ? parentId : null;
            return { ...m, id, parentId: effectiveParentId };
        });
        const childrenByParentId = new Map();
        for (const menu of list) {
            const key = menu.parentId ?? null;
            const arr = childrenByParentId.get(key) || [];
            arr.push(menu);
            childrenByParentId.set(key, arr);
        }
        const attachChildren = (node) => {
            const kids = childrenByParentId.get(node.id) || [];
            if (kids.length) {
                node.children = kids.map((k) => attachChildren(k));
            }
            return node;
        };
        const roots = childrenByParentId.get(null) || [];
        return roots.map((r) => attachChildren(r));
    }
    normalizeId(value) {
        if (value === null || value === undefined)
            return null;
        const trimmed = String(value).trim();
        return trimmed ? trimmed : null;
    }
    normalizeMenus(menus) {
        return menus.map((m) => {
            const cloned = { ...m };
            cloned.id = this.normalizeId(m.id);
            cloned.parentId = this.normalizeId(m.parentId);
            return cloned;
        });
    }
    async queryUserMenus(userId, isSuper) {
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
        if (records.length)
            return records;
        const homeMenu = await this.menuRepository.findOne({
            where: { path: '/home', status: 1 },
        });
        return homeMenu && homeMenu.type !== 3 ? [homeMenu] : [];
    }
    async fillAncestorMenus(menus) {
        const map = new Map();
        const normalized = this.normalizeMenus(menus);
        normalized.forEach((m) => {
            if (m.id)
                map.set(m.id, m);
        });
        let pendingParentIds = Array.from(new Set(normalized
            .map((m) => this.normalizeId(m.parentId))
            .filter((pid) => typeof pid === 'string' && pid.length > 0 && !map.has(pid))));
        while (pendingParentIds.length) {
            const parentIds = pendingParentIds.slice(0, 200);
            pendingParentIds = pendingParentIds.slice(200);
            const parents = await this.menuRepository.findBy({ id: (0, typeorm_2.In)(parentIds) });
            const normalizedParents = this.normalizeMenus(parents);
            normalizedParents.forEach((p) => {
                if (p.id && !map.has(p.id))
                    map.set(p.id, p);
            });
            const newParentIds = normalizedParents
                .map((p) => this.normalizeId(p.parentId))
                .filter((pid) => typeof pid === 'string' && pid.length > 0 && !map.has(pid));
            pendingParentIds = Array.from(new Set([...pendingParentIds, ...newParentIds]));
        }
        return Array.from(map.values()).sort((a, b) => (a.sort || 0) - (b.sort || 0));
    }
    async findOne(id) {
        const menu = await this.menuRepository.findOne({ where: { id } });
        if (!menu) {
            throw new common_1.NotFoundException('菜单不存在');
        }
        return menu;
    }
    async update(id, updateMenuDto) {
        const menu = await this.findOne(id);
        Object.assign(menu, updateMenuDto);
        return this.menuRepository.save(menu);
    }
    async remove(id) {
        const menu = await this.findOne(id);
        const hasChildren = await this.menuRepository.findOne({ where: { parentId: id } });
        if (hasChildren) {
            throw new Error('请先删除子菜单');
        }
        return this.menuRepository.remove(menu);
    }
    async removeMany(ids) {
        const menus = await this.menuRepository.findBy({ id: (0, typeorm_2.In)(ids) });
        if (menus.length === 0) {
            throw new common_1.NotFoundException('未找到要删除的菜单');
        }
        for (const id of ids) {
            const hasChildren = await this.menuRepository.findOne({ where: { parentId: id } });
            if (hasChildren && !ids.includes(hasChildren.id)) {
                throw new Error(`菜单 ${id} 含有子菜单，请先删除子菜单`);
            }
        }
        return this.menuRepository.remove(menus);
    }
};
exports.MenuService = MenuService;
exports.MenuService = MenuService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(menu_entity_1.MenuEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], MenuService);
//# sourceMappingURL=menu.service.js.map