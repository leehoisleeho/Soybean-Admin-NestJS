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
import { IsString, IsOptional, IsInt } from 'class-validator';
import { UserEntity } from './user.entity';
// 如果 menu.entity.ts 文件实际位于其他路径，请改为正确路径
// 例如：import { MenuEntity } from '../menu/menu.entity';
import { MenuEntity } from './menu.entity';

@Entity('sys_role')
export class RoleEntity {
  @ApiProperty({ description: 'ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: '角色名称' })
  @IsString()
  @Column({ length: 50, comment: '角色名称' })
  name: string;

  @ApiProperty({ description: '角色编码' })
  @IsString()
  @Column({ unique: true, length: 50, comment: '角色编码' })
  code: string;

  @ApiProperty({ description: '状态(1:启用, 0:禁用)', default: 1 })
  @Column({ type: 'tinyint', default: 1, comment: '状态(1:启用, 0:禁用)' })
  status: number;

  @ApiProperty({ description: '排序', default: 0 })
  @IsInt()
  @Column({ default: 0, comment: '显示排序' })
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

  @ApiProperty({ description: '删除时间', required: false })
  @DeleteDateColumn({
    type: 'datetime',
    precision: 6,
    nullable: true,
    comment: '删除时间',
  })
  deletedAt: Date;

   
  @ManyToMany(() => UserEntity, (user) => user.roles)
  users: UserEntity[];

  @ManyToMany(() => MenuEntity, (menu) => menu.roles)
  @JoinTable({
    name: 'sys_role_menu',
    joinColumn: { name: 'role_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'menu_id', referencedColumnName: 'id' },
  })
  menus: MenuEntity[];
}
