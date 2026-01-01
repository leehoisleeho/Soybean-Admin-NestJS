import { Repository } from 'typeorm';
import { MenuEntity } from '../../entities/menu.entity';
import { UserEntity } from '../../entities/user.entity';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { QueryMenuDto } from './dto/query-menu.dto';
export declare class MenuService {
    private menuRepository;
    private userRepository;
    constructor(menuRepository: Repository<MenuEntity>, userRepository: Repository<UserEntity>);
    create(createMenuDto: CreateMenuDto): Promise<MenuEntity>;
    findAll(queryMenuDto: QueryMenuDto): Promise<{
        records: MenuEntity[];
        total: number;
        current: number;
        size: number;
    }>;
    getTree(queryMenuDto: QueryMenuDto): Promise<{
        records: any[];
        total: number;
        current: number;
        size: number;
    }>;
    getUserMenuTree(userId: string): Promise<any[]>;
    private buildTree;
    private transformToSoybeanMenu;
    private buildSoybeanTree;
    private normalizeId;
    private normalizeMenus;
    private queryUserMenus;
    private fillAncestorMenus;
    findOne(id: string): Promise<MenuEntity>;
    update(id: string, updateMenuDto: UpdateMenuDto): Promise<MenuEntity>;
    remove(id: string): Promise<MenuEntity>;
    removeMany(ids: string[]): Promise<MenuEntity[]>;
}
