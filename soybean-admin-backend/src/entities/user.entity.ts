import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional } from 'class-validator';
import { RoleEntity } from './role.entity';

@Entity('sys_user')
export class UserEntity {
  @ApiProperty({ description: 'ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: '用户名' })
  @IsString()
  @Column({ unique: true, length: 50, comment: '用户名' })
  username: string;

  @ApiProperty({ description: '密码' })
  @IsString()
  @Column({ length: 255, comment: '密码' })
  password: string;

  @ApiProperty({ description: '昵称', required: false })
  @IsOptional()
  @IsString()
  @Column({ length: 50, nullable: true, comment: '昵称' })
  nickname: string;

  @ApiProperty({ description: '邮箱', required: false })
  @IsOptional()
  @IsEmail()
  @Column({ length: 100, nullable: true, comment: '邮箱' })
  email: string;

  @ApiProperty({ description: '手机号', required: false })
  @IsOptional()
  @IsString()
  @Column({ length: 20, nullable: true, comment: '手机号' })
  phone: string;

  @ApiProperty({ description: '头像', required: false })
  @IsOptional()
  @IsString()
  @Column({ length: 255, nullable: true, comment: '头像' })
  avatar: string;

  @ApiProperty({ description: '状态(1:启用, 0:禁用)', default: 1 })
  @Column({ type: 'tinyint', default: 1, comment: '状态(1:启用, 0:禁用)' })
  status: number;

  @ApiProperty({ description: '备注', required: false })
  @IsOptional()
  @IsString()
  @Column({ length: 255, nullable: true, comment: '备注' })
  remark: string;

  @ApiProperty({ description: '创建时间' })
  @CreateDateColumn({ type: 'datetime', precision: 6, comment: '创建时间' })
  createdAt: Date;

  @ApiProperty({ description: '更新时间' })
  @UpdateDateColumn({ type: 'datetime', precision: 6, comment: '更新时间' })
  updatedAt: Date;

  @ApiProperty({ description: '删除时间', required: false })
  @DeleteDateColumn({
    type: 'datetime',
    precision: 6,
    nullable: true,
    comment: '删除时间',
  })
  deletedAt: Date;

   
  @ManyToMany(() => RoleEntity, (role) => role.users)
  @JoinTable({
    name: 'sys_user_role',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  roles: RoleEntity[];
}
