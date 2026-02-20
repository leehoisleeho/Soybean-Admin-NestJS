import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateMenuDto } from './create-menu.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateMenuDto extends PartialType(CreateMenuDto) {}

export class BatchDeleteMenuDto {
  @ApiProperty({ description: '菜单ID列表', type: [String] })
  @IsNotEmpty({ message: '菜单ID列表不能为空' })
  @IsString({ each: true })
  ids: string[];
}
