import { Repository } from 'typeorm';
import { UserEntity } from '../../entities/user.entity';
import { RoleEntity } from '../../entities/role.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto, UpdateStatusDto, ResetPasswordDto, AssignRolesDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
export declare class UserService {
    private readonly userRepository;
    private readonly roleRepository;
    constructor(userRepository: Repository<UserEntity>, roleRepository: Repository<RoleEntity>);
    create(createUserDto: CreateUserDto): Promise<UserEntity>;
    findAll(queryUserDto: QueryUserDto): Promise<{
        records: UserEntity[];
        total: number;
        current: number;
        size: number;
    }>;
    findOne(id: string): Promise<UserEntity>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<UserEntity>;
    remove(id: string): Promise<UserEntity>;
    removeMany(ids: string[]): Promise<UserEntity[]>;
    updateStatus(id: string, updateStatusDto: UpdateStatusDto): Promise<UserEntity>;
    resetPassword(id: string, resetPasswordDto: ResetPasswordDto): Promise<UserEntity>;
    assignRoles(id: string, assignRolesDto: AssignRolesDto): Promise<UserEntity>;
}
