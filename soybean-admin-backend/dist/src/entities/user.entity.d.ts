import { RoleEntity } from './role.entity';
export declare class UserEntity {
    id: string;
    username: string;
    password: string;
    nickname: string;
    email: string;
    phone: string;
    avatar: string;
    status: number;
    remark: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
    roles: RoleEntity[];
}
