import { CreateRoleDto } from './create-role.dto';
declare const UpdateRoleDto_base: import("@nestjs/common").Type<Partial<CreateRoleDto>>;
export declare class UpdateRoleDto extends UpdateRoleDto_base {
}
export declare class AssignMenusDto {
    menuIds: string[];
}
export declare class BatchDeleteRoleDto {
    ids: string[];
}
export {};
