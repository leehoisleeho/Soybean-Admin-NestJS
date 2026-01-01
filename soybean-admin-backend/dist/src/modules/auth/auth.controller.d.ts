import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { UserEntity } from '../../entities/user.entity';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto, req: any): Promise<{
        token: string;
        refreshToken: string;
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
    getUserInfo(user: UserEntity): Promise<{
        userId: string;
        userName: string;
        roles: string[];
        buttons: string[];
    } | null>;
    getProfile(user: UserEntity): UserEntity;
    logout(): {
        message: string;
    };
    refresh(user: UserEntity): Promise<{
        access_token: string;
    }>;
}
