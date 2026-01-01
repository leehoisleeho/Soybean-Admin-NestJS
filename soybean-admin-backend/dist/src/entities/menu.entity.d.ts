import { RoleEntity } from './role.entity';
export declare class MenuEntity {
    id: string;
    parentId: string;
    name: string;
    path: string;
    component: string;
    redirect: string;
    type: number;
    icon: string;
    permission: string;
    status: number;
    visible: number;
    sort: number;
    remark: string;
    createdAt: Date;
    updatedAt: Date;
    children: MenuEntity[];
    parent: MenuEntity;
    roles: RoleEntity[];
}
