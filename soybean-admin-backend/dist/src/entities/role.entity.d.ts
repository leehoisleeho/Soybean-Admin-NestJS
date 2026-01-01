import { UserEntity } from './user.entity';
import { MenuEntity } from './menu.entity';
export declare class RoleEntity {
    id: string;
    name: string;
    code: string;
    status: number;
    sort: number;
    remark: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
    users: UserEntity[];
    menus: MenuEntity[];
}
