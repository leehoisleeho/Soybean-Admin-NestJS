import { CreateUserDto } from './create-user.dto';
declare const UpdateUserDto_base: import("@nestjs/common").Type<Partial<CreateUserDto>>;
export declare class UpdateUserDto extends UpdateUserDto_base {
}
export declare class UpdateStatusDto {
    status: number;
}
export declare class ResetPasswordDto {
    password: string;
}
export declare class AssignRolesDto {
    roleIds: string[];
}
export {};
