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
exports.MenuController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const menu_service_1 = require("./menu.service");
const create_menu_dto_1 = require("./dto/create-menu.dto");
const update_menu_dto_1 = require("./dto/update-menu.dto");
const query_menu_dto_1 = require("./dto/query-menu.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let MenuController = class MenuController {
    menuService;
    constructor(menuService) {
        this.menuService = menuService;
    }
    create(createMenuDto) {
        return this.menuService.create(createMenuDto);
    }
    getTree(queryMenuDto) {
        return this.menuService.getTree(queryMenuDto);
    }
    getTreeAlias(queryMenuDto) {
        return this.menuService.getTree(queryMenuDto);
    }
    findAll(queryMenuDto) {
        return this.menuService.findAll(queryMenuDto);
    }
    getUserMenuTree(userId) {
        return this.menuService.getUserMenuTree(userId);
    }
    findOne(id) {
        return this.menuService.findOne(id);
    }
    update(id, updateMenuDto) {
        return this.menuService.update(id, updateMenuDto);
    }
    removeMany(batchDeleteMenuDto) {
        return this.menuService.removeMany(batchDeleteMenuDto.ids);
    }
    remove(id) {
        return this.menuService.remove(id);
    }
};
exports.MenuController = MenuController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '创建菜单' }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_menu_dto_1.CreateMenuDto]),
    __metadata("design:returntype", void 0)
], MenuController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '获取菜单树形结构' }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_menu_dto_1.QueryMenuDto]),
    __metadata("design:returntype", void 0)
], MenuController.prototype, "getTree", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '获取菜单树形结构 (alias)' }),
    (0, common_1.Get)('tree'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_menu_dto_1.QueryMenuDto]),
    __metadata("design:returntype", void 0)
], MenuController.prototype, "getTreeAlias", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '获取菜单列表（扁平）' }),
    (0, common_1.Get)('list'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_menu_dto_1.QueryMenuDto]),
    __metadata("design:returntype", void 0)
], MenuController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '获取用户的菜单权限树' }),
    (0, common_1.Get)('user/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MenuController.prototype, "getUserMenuTree", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '获取菜单详情' }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MenuController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '更新菜单' }),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_menu_dto_1.UpdateMenuDto]),
    __metadata("design:returntype", void 0)
], MenuController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '批量删除菜单' }),
    (0, common_1.Delete)('batch'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_menu_dto_1.BatchDeleteMenuDto]),
    __metadata("design:returntype", void 0)
], MenuController.prototype, "removeMany", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '删除菜单' }),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MenuController.prototype, "remove", null);
exports.MenuController = MenuController = __decorate([
    (0, swagger_1.ApiTags)('菜单管理'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('menu'),
    __metadata("design:paramtypes", [menu_service_1.MenuService])
], MenuController);
//# sourceMappingURL=menu.controller.js.map