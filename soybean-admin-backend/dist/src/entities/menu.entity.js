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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuEntity = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const role_entity_1 = require("./role.entity");
let MenuEntity = class MenuEntity {
    id;
    parentId;
    name;
    path;
    component;
    redirect;
    type;
    icon;
    permission;
    status;
    visible;
    sort;
    remark;
    createdAt;
    updatedAt;
    children;
    parent;
    roles;
};
exports.MenuEntity = MenuEntity;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID' }),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], MenuEntity.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '父菜单ID', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, typeorm_1.Column)({
        name: 'parent_id',
        length: 36,
        nullable: true,
        comment: '父菜单ID',
    }),
    __metadata("design:type", String)
], MenuEntity.prototype, "parentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '菜单名称' }),
    (0, class_validator_1.IsString)(),
    (0, typeorm_1.Column)({ length: 50, comment: '菜单名称' }),
    __metadata("design:type", String)
], MenuEntity.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '路由路径', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, typeorm_1.Column)({ length: 255, nullable: true, comment: '路由路径' }),
    __metadata("design:type", String)
], MenuEntity.prototype, "path", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '组件路径', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, typeorm_1.Column)({ length: 255, nullable: true, comment: '组件路径' }),
    __metadata("design:type", String)
], MenuEntity.prototype, "component", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '重定向地址', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, typeorm_1.Column)({ length: 255, nullable: true, comment: '重定向地址' }),
    __metadata("design:type", String)
], MenuEntity.prototype, "redirect", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '类型(1:目录, 2:菜单, 3:按钮)', default: 1 }),
    (0, class_validator_1.IsEnum)([1, 2, 3]),
    (0, typeorm_1.Column)({
        type: 'tinyint',
        default: 1,
        comment: '类型(1:目录, 2:菜单, 3:按钮)',
    }),
    __metadata("design:type", Number)
], MenuEntity.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '图标', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, typeorm_1.Column)({ length: 100, nullable: true, comment: '图标' }),
    __metadata("design:type", String)
], MenuEntity.prototype, "icon", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '权限标识', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, typeorm_1.Column)({ length: 100, nullable: true, comment: '权限标识' }),
    __metadata("design:type", String)
], MenuEntity.prototype, "permission", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '状态(1:启用, 0:禁用)', default: 1 }),
    (0, typeorm_1.Column)({ type: 'tinyint', default: 1, comment: '状态(1:启用, 0:禁用)' }),
    __metadata("design:type", Number)
], MenuEntity.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '是否显示(1:是, 0:否)', default: 1 }),
    (0, typeorm_1.Column)({ type: 'tinyint', default: 1, comment: '是否显示(1:是, 0:否)' }),
    __metadata("design:type", Number)
], MenuEntity.prototype, "visible", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '排序', default: 0 }),
    (0, class_validator_1.IsInt)(),
    (0, typeorm_1.Column)({ default: 0, comment: '排序' }),
    __metadata("design:type", Number)
], MenuEntity.prototype, "sort", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '备注', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, typeorm_1.Column)({ length: 255, nullable: true, comment: '备注' }),
    __metadata("design:type", String)
], MenuEntity.prototype, "remark", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '创建时间' }),
    (0, typeorm_1.CreateDateColumn)({ type: 'datetime', precision: 6, comment: '创建时间' }),
    __metadata("design:type", Date)
], MenuEntity.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '更新时间' }),
    (0, typeorm_1.UpdateDateColumn)({ type: 'datetime', precision: 6, comment: '更新时间' }),
    __metadata("design:type", Date)
], MenuEntity.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.TreeChildren)(),
    __metadata("design:type", Array)
], MenuEntity.prototype, "children", void 0);
__decorate([
    (0, typeorm_1.TreeParent)(),
    __metadata("design:type", MenuEntity)
], MenuEntity.prototype, "parent", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => role_entity_1.RoleEntity, (role) => role.menus),
    __metadata("design:type", Array)
], MenuEntity.prototype, "roles", void 0);
exports.MenuEntity = MenuEntity = __decorate([
    (0, typeorm_1.Entity)('sys_menu'),
    (0, typeorm_1.Tree)('materialized-path')
], MenuEntity);
//# sourceMappingURL=menu.entity.js.map