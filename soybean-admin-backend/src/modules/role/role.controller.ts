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
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto, AssignMenusDto, BatchDeleteRoleDto } from './dto/update-role.dto';
import { QueryRoleDto } from './dto/query-role.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('角色管理')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) { }

  @ApiOperation({ summary: '创建角色' })
  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @ApiOperation({ summary: '获取角色列表' })
  @Get()
  findAll(@Query() queryRoleDto: QueryRoleDto) {
    return this.roleService.findAll(queryRoleDto);
  }

  @ApiOperation({ summary: '获取角色详情' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roleService.findOne(id);
  }

  @ApiOperation({ summary: '更新角色' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(id, updateRoleDto);
  }

  @ApiOperation({ summary: '批量删除角色' })
  @Delete('batch')
  removeMany(@Body() batchDeleteRoleDto: BatchDeleteRoleDto) {
    return this.roleService.removeMany(batchDeleteRoleDto.ids);
  }

  @ApiOperation({ summary: '删除角色' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roleService.remove(id);
  }

  @ApiOperation({ summary: '分配菜单权限' })
  @Post(':id/menus')
  assignMenus(@Param('id') id: string, @Body() assignMenusDto: AssignMenusDto) {
    return this.roleService.assignMenus(id, assignMenusDto);
  }

  @ApiOperation({ summary: '获取角色的菜单权限' })
  @Get(':id/menus')
  findRoleMenus(@Param('id') id: string) {
    return this.roleService.findRoleMenus(id);
  }
}
