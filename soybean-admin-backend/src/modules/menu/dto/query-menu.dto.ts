import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';

export class QueryMenuDto {
  @ApiProperty({ description: '菜单名称', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: '菜单状态（0:禁用, 1:启用）', enum: [0, 1], required: false })
  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : Number(value)))
  @IsEnum([0, 1])
  status?: number;
}
