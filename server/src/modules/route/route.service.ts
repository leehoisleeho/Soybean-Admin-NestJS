import { Injectable } from '@nestjs/common';
import { MenuService } from '../menu/menu.service';

@Injectable()
export class RouteService {
  constructor(private readonly menuService: MenuService) {}

  /**
   * 获取用户的路由
   * @param userId 用户ID
   */
  async getUserRoutes(userId: string) {
    const routes = await this.menuService.getUserMenuTree(userId);
    return {
      routes,
      home: 'home', // 默认首页
    };
  }

  /**
   * 获取常量路由
   */
  async getConstantRoutes() {
    return []; // 常量路由通常在前端定义，这里返回空
  }

  /**
   * 检查路由是否存在
   */
  async isRouteExist(_routeName: string) {
    return true; // 简单实现，直接返回 true
  }
}
