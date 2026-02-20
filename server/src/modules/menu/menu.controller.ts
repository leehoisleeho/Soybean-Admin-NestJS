import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto, BatchDeleteMenuDto } from './dto/update-menu.dto';
import { QueryMenuDto } from './dto/query-menu.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';

@ApiTags('菜单管理')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) { }

  @ApiOperation({ summary: '创建菜单' })
  @RequirePermissions('sys:menu:add')
  @Post()
  create(@Body() createMenuDto: CreateMenuDto) {
    return this.menuService.create(createMenuDto);
  }

  @ApiOperation({ summary: '获取菜单树形结构' })
  @Get()
  getTree(@Query() queryMenuDto: QueryMenuDto) {
    return this.menuService.getTree(queryMenuDto);
  }

  @ApiOperation({ summary: '获取菜单树形结构 (alias)' })
  @Get('tree')
  getTreeAlias(@Query() queryMenuDto: QueryMenuDto) {
    return this.menuService.getTree(queryMenuDto);
  }

  @ApiOperation({ summary: '获取菜单列表（扁平）' })
  @Get('list')
  findAll(@Query() queryMenuDto: QueryMenuDto) {
    return this.menuService.findAll(queryMenuDto);
  }

  @ApiOperation({ summary: '获取用户的菜单权限树' })
  @Get('user/:userId')
  getUserMenuTree(@Param('userId') userId: string) {
    return this.menuService.getUserMenuTree(userId);
  }

  @ApiOperation({ summary: '获取菜单详情' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.menuService.findOne(id);
  }

  @ApiOperation({ summary: '更新菜单' })
  @RequirePermissions('sys:menu:edit')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMenuDto: UpdateMenuDto) {
    return this.menuService.update(id, updateMenuDto);
  }

  @ApiOperation({ summary: '批量删除菜单' })
  @RequirePermissions('sys:menu:delete')
  @Delete('batch')
  removeMany(@Body() batchDeleteMenuDto: BatchDeleteMenuDto) {
    return this.menuService.removeMany(batchDeleteMenuDto.ids);
  }

  @ApiOperation({ summary: '删除菜单' })
  @RequirePermissions('sys:menu:delete')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.menuService.remove(id);
  }
}
