import { Repository } from 'typeorm';
import { RoleEntity } from '../../entities/role.entity';
import { MenuEntity } from '../../entities/menu.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto, AssignMenusDto } from './dto/update-role.dto';
import { QueryRoleDto } from './dto/query-role.dto';
export declare class RoleService {
    private readonly roleRepository;
    private readonly menuRepository;
    constructor(roleRepository: Repository<RoleEntity>, menuRepository: Repository<MenuEntity>);
    create(createRoleDto: CreateRoleDto): Promise<RoleEntity>;
    findAll(queryRoleDto: QueryRoleDto): Promise<{
        records: RoleEntity[];
        total: number;
        current: number;
        size: number;
    }>;
    findOne(id: string): Promise<RoleEntity>;
    update(id: string, updateRoleDto: UpdateRoleDto): Promise<RoleEntity>;
    remove(id: string): Promise<RoleEntity>;
    removeMany(ids: string[]): Promise<RoleEntity[]>;
    assignMenus(id: string, assignMenusDto: AssignMenusDto): Promise<RoleEntity>;
    private resolveMenuIdsWithAncestors;
    findRoleMenus(id: string): Promise<MenuEntity[]>;
}
