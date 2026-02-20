import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsOptional, IsEnum, IsUUID, Min } from 'class-validator';

export class CreateMenuDto {
  @ApiProperty({ description: '父级菜单ID', required: false })
  @IsOptional()
  @IsString()
  parentId?: string;

  @ApiProperty({ description: '菜单名称' })
  @IsString()
  name: string;

  @ApiProperty({ description: '路由路径', required: false })
  @IsOptional()
  @IsString()
  path?: string;

  @ApiProperty({ description: '组件路径', required: false })
  @IsOptional()
  @IsString()
  component?: string;

  @ApiProperty({ description: '重定向路径', required: false })
  @IsOptional()
  @IsString()
  redirect?: string;

  @ApiProperty({ description: '菜单类型（1:目录, 2:菜单, 3:按钮）', enum: [1, 2, 3] })
  @IsOptional()
  type: number;

  @ApiProperty({ description: '菜单图标', required: false })
  @IsOptional()
  icon?: string;

  @ApiProperty({ description: '权限标识', required: false })
  @IsOptional()
  @IsString()
  permission?: string;

  @ApiProperty({ description: '菜单状态（0:禁用, 1:启用）', enum: [0, 1], default: 1 })
  @IsOptional()
  @IsEnum([0, 1])
  status?: number;

  @ApiProperty({ description: '是否可见（0:隐藏, 1:显示）', enum: [0, 1], default: 1 })
  @IsOptional()
  @IsEnum([0, 1])
  visible?: number;

  @ApiProperty({ description: '排序', default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  sort?: number;

  @ApiProperty({ description: '备注', required: false })
  @IsOptional()
  @IsString()
  remark?: string;
}
