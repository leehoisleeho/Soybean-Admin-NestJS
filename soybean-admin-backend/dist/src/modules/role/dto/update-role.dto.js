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
exports.BatchDeleteRoleDto = exports.AssignMenusDto = exports.UpdateRoleDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_role_dto_1 = require("./create-role.dto");
const class_validator_1 = require("class-validator");
class UpdateRoleDto extends (0, swagger_1.PartialType)(create_role_dto_1.CreateRoleDto) {
}
exports.UpdateRoleDto = UpdateRoleDto;
class AssignMenusDto {
    menuIds;
}
exports.AssignMenusDto = AssignMenusDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: '菜单ID列表', type: [String] }),
    (0, class_validator_1.IsNotEmpty)({ message: '菜单ID列表不能为空' }),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], AssignMenusDto.prototype, "menuIds", void 0);
class BatchDeleteRoleDto {
    ids;
}
exports.BatchDeleteRoleDto = BatchDeleteRoleDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: '角色ID列表', type: [String] }),
    (0, class_validator_1.IsNotEmpty)({ message: '角色ID列表不能为空' }),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], BatchDeleteRoleDto.prototype, "ids", void 0);
//# sourceMappingURL=update-role.dto.js.map