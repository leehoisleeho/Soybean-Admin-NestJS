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
exports.CreateMenuDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateMenuDto {
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
}
exports.CreateMenuDto = CreateMenuDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: '父级菜单ID', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateMenuDto.prototype, "parentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '菜单名称' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMenuDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '路由路径', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMenuDto.prototype, "path", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '组件路径', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMenuDto.prototype, "component", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '重定向路径', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMenuDto.prototype, "redirect", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '菜单类型（1:目录, 2:菜单, 3:按钮）', enum: [1, 2, 3] }),
    (0, class_validator_1.IsEnum)([1, 2, 3]),
    __metadata("design:type", Number)
], CreateMenuDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '菜单图标', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMenuDto.prototype, "icon", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '权限标识', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMenuDto.prototype, "permission", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '菜单状态（0:禁用, 1:启用）', enum: [0, 1], default: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)([0, 1]),
    __metadata("design:type", Number)
], CreateMenuDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '是否可见（0:隐藏, 1:显示）', enum: [0, 1], default: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)([0, 1]),
    __metadata("design:type", Number)
], CreateMenuDto.prototype, "visible", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '排序', default: 0 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateMenuDto.prototype, "sort", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '备注', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMenuDto.prototype, "remark", void 0);
//# sourceMappingURL=create-menu.dto.js.map