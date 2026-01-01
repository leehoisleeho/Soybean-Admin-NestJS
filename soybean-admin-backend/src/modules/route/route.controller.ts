import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RouteService } from './route.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('路由管理')
@Controller('route')
export class RouteController {
  constructor(private readonly routeService: RouteService) { }

  @ApiOperation({ summary: '获取用户路由' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('getUserRoutes')
  async getUserRoutes(@Request() req) {
    return this.routeService.getUserRoutes(req.user.id);
  }

  @ApiOperation({ summary: '获取常量路由' })
  @Get('getConstantRoutes')
  async getConstantRoutes() {
    return this.routeService.getConstantRoutes();
  }

  @ApiOperation({ summary: '检查路由是否存在' })
  @Get('isRouteExist')
  async isRouteExist(@Query('routeName') routeName: string) {
    return this.routeService.isRouteExist(routeName);
  }
}
