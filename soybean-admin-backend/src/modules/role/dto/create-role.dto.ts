import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsInt, IsEnum } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ description: '角色名称' })
  @IsNotEmpty({ message: '角色名称不能为空' })
  @IsString()
  name: string;

  @ApiProperty({ description: '角色编码' })
  @IsNotEmpty({ message: '角色编码不能为空' })
  @IsString()
  code: string;

  @ApiProperty({ description: '排序', default: 0 })
  @IsOptional()
  @IsInt()
  sort?: number = 0;

  @ApiProperty({ description: '状态', enum: [0, 1], default: 1 })
  @IsOptional()
  @IsEnum([0, 1])
  status?: number = 1;

  @ApiProperty({ description: '备注', required: false })
  @IsOptional()
  @IsString()
  remark?: string;
}
