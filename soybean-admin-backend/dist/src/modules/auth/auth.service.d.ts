import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { UserEntity } from '../../entities/user.entity';
import { RegisterDto } from './dto/auth.dto';
export declare class AuthService {
    private userRepository;
    private jwtService;
    constructor(userRepository: Repository<UserEntity>, jwtService: JwtService);
    validateUser(username: string, pass: string): Promise<any>;
    login(user: any): Promise<{
        access_token: string;
        user: any;
    }>;
    register(registerDto: RegisterDto): Promise<{
        id: string;
        username: string;
        nickname: string;
        email: string;
        phone: string;
        avatar: string;
        status: number;
        remark: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date;
        roles: import("../../entities/role.entity").RoleEntity[];
    }>;
    refreshToken(user: any): {
        access_token: string;
    };
    findUserById(id: string): Promise<UserEntity | null>;
    getUserInfo(userId: string): Promise<{
        userId: string;
        userName: string;
        roles: string[];
        buttons: string[];
    } | null>;
}
