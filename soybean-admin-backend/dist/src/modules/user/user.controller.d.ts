import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto, UpdateStatusDto, ResetPasswordDto, AssignRolesDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    create(createUserDto: CreateUserDto): Promise<import("../../entities/user.entity").UserEntity>;
    findAll(queryUserDto: QueryUserDto): Promise<{
        records: import("../../entities/user.entity").UserEntity[];
        total: number;
        current: number;
        size: number;
    }>;
    findOne(id: string): Promise<import("../../entities/user.entity").UserEntity>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<import("../../entities/user.entity").UserEntity>;
    removeMany(ids: string[]): Promise<import("../../entities/user.entity").UserEntity[]>;
    remove(id: string): Promise<import("../../entities/user.entity").UserEntity>;
    updateStatus(id: string, updateStatusDto: UpdateStatusDto): Promise<import("../../entities/user.entity").UserEntity>;
    resetPassword(id: string, resetPasswordDto: ResetPasswordDto): Promise<import("../../entities/user.entity").UserEntity>;
    assignRoles(id: string, assignRolesDto: AssignRolesDto): Promise<import("../../entities/user.entity").UserEntity>;
}
