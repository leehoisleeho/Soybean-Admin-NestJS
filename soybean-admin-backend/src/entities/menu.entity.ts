import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, IsEnum } from 'class-validator';
import { RoleEntity } from './role.entity';

@Entity('sys_menu')
@Tree('materialized-path')
export class MenuEntity {
  @ApiProperty({ description: 'ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: '父菜单ID', required: false })
  @IsOptional()
  @IsString()
  @Column({
    name: 'parent_id',
    length: 36,
    nullable: true,
    comment: '父菜单ID',
  })
  parentId: string;

  @ApiProperty({ description: '菜单名称' })
  @IsString()
  @Column({ length: 50, comment: '菜单名称' })
  name: string;

  @ApiProperty({ description: '路由路径', required: false })
  @IsOptional()
  @IsString()
  @Column({ length: 255, nullable: true, comment: '路由路径' })
  path: string;

  @ApiProperty({ description: '组件路径', required: false })
  @IsOptional()
  @IsString()
  @Column({ length: 255, nullable: true, comment: '组件路径' })
  component: string;

  @ApiProperty({ description: '重定向地址', required: false })
  @IsOptional()
  @IsString()
  @Column({ length: 255, nullable: true, comment: '重定向地址' })
  redirect: string;

  @ApiProperty({ description: '类型(1:目录, 2:菜单, 3:按钮)', default: 1 })
  @IsEnum([1, 2, 3])
  @Column({
    type: 'tinyint',
    default: 1,
    comment: '类型(1:目录, 2:菜单, 3:按钮)',
  })
  type: number;

  @ApiProperty({ description: '图标', required: false })
  @IsOptional()
  @IsString()
  @Column({ length: 100, nullable: true, comment: '图标' })
  icon: string;

  @ApiProperty({ description: '权限标识', required: false })
  @IsOptional()
  @IsString()
  @Column({ length: 100, nullable: true, comment: '权限标识' })
  permission: string;

  @ApiProperty({ description: '状态(1:启用, 0:禁用)', default: 1 })
  @Column({ type: 'tinyint', default: 1, comment: '状态(1:启用, 0:禁用)' })
  status: number;

  @ApiProperty({ description: '是否显示(1:是, 0:否)', default: 1 })
  @Column({ type: 'tinyint', default: 1, comment: '是否显示(1:是, 0:否)' })
  visible: number;

  @ApiProperty({ description: '排序', default: 0 })
  @IsInt()
  @Column({ default: 0, comment: '排序' })
  sort: number;

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

  @TreeChildren()
  children: MenuEntity[];

  @TreeParent()
  parent: MenuEntity;

   
  @ManyToMany(() => RoleEntity, (role) => role.menus)
  roles: RoleEntity[];
}
