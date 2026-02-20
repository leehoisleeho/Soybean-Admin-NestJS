import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import type { UserEntity } from '../../entities/user.entity';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions =
      this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [context.getHandler(), context.getClass()]) || [];

    if (!requiredPermissions.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as UserEntity | undefined;

    if (!user) {
      throw new ForbiddenException('无权限');
    }

    const isSuper = user.roles?.some(role => role.code === 'R_SUPER') ?? false;
    if (isSuper) {
      return true;
    }

    const permissionSet = new Set<string>();
    user.roles?.forEach(role => {
      role.menus?.forEach(menu => {
        if (menu.type === 3 && menu.permission) {
          permissionSet.add(menu.permission);
        }
      });
    });

    const hasPermission = requiredPermissions.some(code => permissionSet.has(code));

    if (!hasPermission) {
      throw new ForbiddenException('无权限');
    }

    return true;
  }
}

