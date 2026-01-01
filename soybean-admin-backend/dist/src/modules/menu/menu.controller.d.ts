import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto, BatchDeleteMenuDto } from './dto/update-menu.dto';
import { QueryMenuDto } from './dto/query-menu.dto';
export declare class MenuController {
    private readonly menuService;
    constructor(menuService: MenuService);
    create(createMenuDto: CreateMenuDto): Promise<import("../../entities/menu.entity").MenuEntity>;
    getTree(queryMenuDto: QueryMenuDto): Promise<{
        records: any[];
        total: number;
        current: number;
        size: number;
    }>;
    getTreeAlias(queryMenuDto: QueryMenuDto): Promise<{
        records: any[];
        total: number;
        current: number;
        size: number;
    }>;
    findAll(queryMenuDto: QueryMenuDto): Promise<{
        records: import("../../entities/menu.entity").MenuEntity[];
        total: number;
        current: number;
        size: number;
    }>;
    getUserMenuTree(userId: string): Promise<any[]>;
    findOne(id: string): Promise<import("../../entities/menu.entity").MenuEntity>;
    update(id: string, updateMenuDto: UpdateMenuDto): Promise<import("../../entities/menu.entity").MenuEntity>;
    removeMany(batchDeleteMenuDto: BatchDeleteMenuDto): Promise<import("../../entities/menu.entity").MenuEntity[]>;
    remove(id: string): Promise<import("../../entities/menu.entity").MenuEntity>;
}
