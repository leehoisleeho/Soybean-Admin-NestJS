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
exports.RoleEntity = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const user_entity_1 = require("./user.entity");
const menu_entity_1 = require("./menu.entity");
let RoleEntity = class RoleEntity {
    id;
    name;
    code;
    status;
    sort;
    remark;
    createdAt;
    updatedAt;
    deletedAt;
    users;
    menus;
};
exports.RoleEntity = RoleEntity;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID' }),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], RoleEntity.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '角色名称' }),
    (0, class_validator_1.IsString)(),
    (0, typeorm_1.Column)({ length: 50, comment: '角色名称' }),
    __metadata("design:type", String)
], RoleEntity.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '角色编码' }),
    (0, class_validator_1.IsString)(),
    (0, typeorm_1.Column)({ unique: true, length: 50, comment: '角色编码' }),
    __metadata("design:type", String)
], RoleEntity.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '状态(1:启用, 0:禁用)', default: 1 }),
    (0, typeorm_1.Column)({ type: 'tinyint', default: 1, comment: '状态(1:启用, 0:禁用)' }),
    __metadata("design:type", Number)
], RoleEntity.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '排序', default: 0 }),
    (0, class_validator_1.IsInt)(),
    (0, typeorm_1.Column)({ default: 0, comment: '显示排序' }),
    __metadata("design:type", Number)
], RoleEntity.prototype, "sort", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '备注', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, typeorm_1.Column)({ length: 255, nullable: true, comment: '备注' }),
    __metadata("design:type", String)
], RoleEntity.prototype, "remark", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '创建时间' }),
    (0, typeorm_1.CreateDateColumn)({ type: 'datetime', precision: 6, comment: '创建时间' }),
    __metadata("design:type", Date)
], RoleEntity.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '更新时间' }),
    (0, typeorm_1.UpdateDateColumn)({ type: 'datetime', precision: 6, comment: '更新时间' }),
    __metadata("design:type", Date)
], RoleEntity.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '删除时间', required: false }),
    (0, typeorm_1.DeleteDateColumn)({
        type: 'datetime',
        precision: 6,
        nullable: true,
        comment: '删除时间',
    }),
    __metadata("design:type", Date)
], RoleEntity.prototype, "deletedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => user_entity_1.UserEntity, (user) => user.roles),
    __metadata("design:type", Array)
], RoleEntity.prototype, "users", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => menu_entity_1.MenuEntity, (menu) => menu.roles),
    (0, typeorm_1.JoinTable)({
        name: 'sys_role_menu',
        joinColumn: { name: 'role_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'menu_id', referencedColumnName: 'id' },
    }),
    __metadata("design:type", Array)
], RoleEntity.prototype, "menus", void 0);
exports.RoleEntity = RoleEntity = __decorate([
    (0, typeorm_1.Entity)('sys_role')
], RoleEntity);
//# sourceMappingURL=role.entity.js.map