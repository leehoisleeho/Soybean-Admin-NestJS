import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateRoleDto } from './create-role.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateRoleDto extends PartialType(CreateRoleDto) {}

export class AssignMenusDto {
  @ApiProperty({ description: '菜单ID列表', type: [String] })
  @IsNotEmpty({ message: '菜单ID列表不能为空' })
  @IsString({ each: true })
  menuIds: string[];
}

export class BatchDeleteRoleDto {
  @ApiProperty({ description: '角色ID列表', type: [String] })
  @IsNotEmpty({ message: '角色ID列表不能为空' })
  @IsString({ each: true })
  ids: string[];
}
