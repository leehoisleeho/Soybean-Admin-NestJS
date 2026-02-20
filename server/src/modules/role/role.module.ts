import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { RoleEntity } from '../../entities/role.entity';
import { MenuEntity } from '../../entities/menu.entity';
import { UserEntity } from '../../entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RoleEntity, MenuEntity, UserEntity])],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}
