import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto, AssignMenusDto, BatchDeleteRoleDto } from './dto/update-role.dto';
import { QueryRoleDto } from './dto/query-role.dto';
export declare class RoleController {
    private readonly roleService;
    constructor(roleService: RoleService);
    create(createRoleDto: CreateRoleDto): Promise<import("../../entities/role.entity").RoleEntity>;
    findAll(queryRoleDto: QueryRoleDto): Promise<{
        records: import("../../entities/role.entity").RoleEntity[];
        total: number;
        current: number;
        size: number;
    }>;
    findOne(id: string): Promise<import("../../entities/role.entity").RoleEntity>;
    update(id: string, updateRoleDto: UpdateRoleDto): Promise<import("../../entities/role.entity").RoleEntity>;
    removeMany(batchDeleteRoleDto: BatchDeleteRoleDto): Promise<import("../../entities/role.entity").RoleEntity[]>;
    remove(id: string): Promise<import("../../entities/role.entity").RoleEntity>;
    assignMenus(id: string, assignMenusDto: AssignMenusDto): Promise<import("../../entities/role.entity").RoleEntity>;
    findRoleMenus(id: string): Promise<import("../../entities/menu.entity").MenuEntity[]>;
}
