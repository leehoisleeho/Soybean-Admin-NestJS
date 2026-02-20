import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsString, MinLength, IsNotEmpty } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) { }

export class UpdateStatusDto {
  @ApiProperty({ description: '状态', enum: [0, 1] })
  @IsOptional()
  status: number;
}

export class ResetPasswordDto {
  @ApiProperty({ description: '新密码' })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}

export class AssignRolesDto {
  @ApiProperty({ description: '角色ID列表', type: [String] })
  @IsNotEmpty()
  @IsString({ each: true })
  roleIds: string[];
}
