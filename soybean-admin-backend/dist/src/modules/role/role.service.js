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
exports.RoleService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const role_entity_1 = require("../../entities/role.entity");
const menu_entity_1 = require("../../entities/menu.entity");
let RoleService = class RoleService {
    roleRepository;
    menuRepository;
    constructor(roleRepository, menuRepository) {
        this.roleRepository = roleRepository;
        this.menuRepository = menuRepository;
    }
    async create(createRoleDto) {
        const { code } = createRoleDto;
        const existingRole = await this.roleRepository.findOne({ where: { code } });
        if (existingRole) {
            throw new common_1.ConflictException('角色编码已存在');
        }
        const role = this.roleRepository.create(createRoleDto);
        return this.roleRepository.save(role);
    }
    async findAll(queryRoleDto) {
        const { page = 1, pageSize = 10, name, code, status } = queryRoleDto;
        const where = {};
        if (name)
            where.name = (0, typeorm_2.Like)(`%${name}%`);
        if (code)
            where.code = (0, typeorm_2.Like)(`%${code}%`);
        if (status !== undefined)
            where.status = status;
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
    async findOne(id) {
        const role = await this.roleRepository.findOne({
            where: { id },
            relations: ['menus'],
        });
        if (!role) {
            throw new common_1.NotFoundException('角色不存在');
        }
        return role;
    }
    async update(id, updateRoleDto) {
        const role = await this.findOne(id);
        const { code } = updateRoleDto;
        if (code && code !== role.code) {
            const existingRole = await this.roleRepository.findOne({
                where: { code, id: (0, typeorm_2.Not)(id) },
            });
            if (existingRole) {
                throw new common_1.ConflictException('角色编码已存在');
            }
        }
        Object.assign(role, updateRoleDto);
        return this.roleRepository.save(role);
    }
    async remove(id) {
        const role = await this.findOne(id);
        return this.roleRepository.softRemove(role);
    }
    async removeMany(ids) {
        const roles = await this.roleRepository.findBy({ id: (0, typeorm_2.In)(ids) });
        if (roles.length === 0) {
            throw new common_1.NotFoundException('未找到要删除的角色');
        }
        return this.roleRepository.softRemove(roles);
    }
    async assignMenus(id, assignMenusDto) {
        const role = await this.findOne(id);
        const menuIds = Array.isArray(assignMenusDto.menuIds) ? assignMenusDto.menuIds : [];
        if (menuIds.length === 0) {
            role.menus = [];
            return this.roleRepository.save(role);
        }
        const resolvedMenuIds = await this.resolveMenuIdsWithAncestors(menuIds);
        const menus = await this.menuRepository.findBy({ id: (0, typeorm_2.In)(resolvedMenuIds) });
        role.menus = menus;
        return this.roleRepository.save(role);
    }
    async resolveMenuIdsWithAncestors(menuIds) {
        const resolvedIds = new Set();
        const pendingIds = new Set(menuIds);
        while (pendingIds.size) {
            const idsToFetch = Array.from(pendingIds);
            pendingIds.clear();
            idsToFetch.forEach(id => resolvedIds.add(id));
            const menus = await this.menuRepository.findBy({ id: (0, typeorm_2.In)(idsToFetch) });
            menus.forEach(menu => {
                if (menu.parentId && !resolvedIds.has(menu.parentId)) {
                    pendingIds.add(menu.parentId);
                }
            });
        }
        return Array.from(resolvedIds);
    }
    async findRoleMenus(id) {
        const role = await this.roleRepository.findOne({
            where: { id },
            relations: ['menus'],
        });
        if (!role) {
            throw new common_1.NotFoundException('角色不存在');
        }
        return role.menus;
    }
};
exports.RoleService = RoleService;
exports.RoleService = RoleService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(role_entity_1.RoleEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(menu_entity_1.MenuEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], RoleService);
//# sourceMappingURL=role.service.js.map