import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { AppModule } from '../../app.module';
import { UserEntity } from '../../entities/user.entity';
import { RoleEntity } from '../../entities/role.entity';
import { MenuEntity } from '../../entities/menu.entity';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);
  const queryRunner = dataSource.createQueryRunner();

  await queryRunner.connect();
  console.log('--- 数据库连接成功，开始初始化种子数据 ---');

  try {
    // 1. 创建角色
    const roleRepo = dataSource.getRepository(RoleEntity);

    let adminRole = await roleRepo.findOne({ where: { code: 'R_SUPER' } });
    if (!adminRole) {
      adminRole = roleRepo.create({
        name: '超级管理员',
        code: 'R_SUPER',
        status: 1,
        sort: 1,
        remark: '拥有系统所有权限',
      });
      adminRole = await roleRepo.save(adminRole);
      console.log('✔ 已创建超级管理员角色');
    }

    let userRole = await roleRepo.findOne({ where: { code: 'R_USER' } });
    if (!userRole) {
      userRole = roleRepo.create({
        name: '普通用户',
        code: 'R_USER',
        status: 1,
        sort: 2,
        remark: '拥有基础查看权限',
      });
      userRole = await roleRepo.save(userRole);
      console.log('✔ 已创建普通用户角色');
    }

    // 2. 创建菜单
    const menuRepo = dataSource.getRepository(MenuEntity);

    // 清除旧菜单（可选，视需求而定，这里我们使用 upsert 逻辑）
    const menusData = [
      {
        id: 'dashboard-id',
        name: '仪表盘',
        path: '/home',
        component: 'layout.base$view.home',
        type: 2,
        icon: 'mdi:monitor-dashboard',
        status: 1,
        visible: 1,
        sort: 1,
      },
      {
        id: 'sys-manage-id',
        name: '系统管理',
        path: '/system',
        component: 'layout.base',
        type: 1,
        icon: 'ic:round-settings',
        status: 1,
        visible: 1,
        sort: 10,
      },
      {
        id: 'sys-user-id',
        parentId: 'sys-manage-id',
        name: '用户管理',
        path: '/system/user',
        component: 'view.system_user',
        type: 2,
        icon: 'ic:round-manage-accounts',
        status: 1,
        visible: 1,
        sort: 1,
      },
      {
        id: 'sys-role-id',
        parentId: 'sys-manage-id',
        name: '角色管理',
        path: '/system/role',
        component: 'view.system_role',
        type: 2,
        icon: 'ic:round-person-search',
        status: 1,
        visible: 1,
        sort: 2,
      },
      {
        id: 'sys-menu-id',
        parentId: 'sys-manage-id',
        name: '菜单管理',
        path: '/system/menu',
        component: 'view.system_menu',
        type: 2,
        icon: 'ic:round-menu',
        status: 1,
        visible: 1,
        sort: 3,
      },
      {
        name: '用户新增',
        parentId: 'sys-user-id',
        type: 3,
        permission: 'sys:user:add',
        status: 1,
        visible: 1,
        sort: 1,
      },
      {
        name: '用户编辑',
        parentId: 'sys-user-id',
        type: 3,
        permission: 'sys:user:edit',
        status: 1,
        visible: 1,
        sort: 2,
      },
      {
        name: '用户删除',
        parentId: 'sys-user-id',
        type: 3,
        permission: 'sys:user:delete',
        status: 1,
        visible: 1,
        sort: 3,
      },
    ];

    for (const item of menusData) {
      let menu = await menuRepo.findOne({ where: { name: item.name, type: item.type } });
      if (!menu) {
        menu = menuRepo.create(item);
        await menuRepo.save(menu);
      } else {
        // 如果已存在且图标不同，则更新图标
        if (item.icon && menu.icon !== item.icon) {
          menu.icon = item.icon;
          await menuRepo.save(menu);
        }
      }
    }
    console.log('✔ 已创建系统菜单结构');

    // 3. 角色关联菜单
    const allMenus = await menuRepo.find();
    adminRole.menus = allMenus;
    await roleRepo.save(adminRole);
    console.log('✔ 已配置超级管理员角色菜单权限');

    // 4. 创建管理员用户
    const userRepo = dataSource.getRepository(UserEntity);
    const adminUserExists = await userRepo.findOne({ where: { username: 'admin' } });
    if (!adminUserExists) {
      const hashedPassword = await bcrypt.hash('123456', 10);
      const adminUser = userRepo.create({
        username: 'admin',
        password: hashedPassword,
        nickname: '超级管理员',
        status: 1,
        roles: [adminRole],
      });
      await userRepo.save(adminUser);
      console.log('✔ 已创建超级管理员用户: admin / 123456');
    }

    console.log('--- 种子数据初始化完成 ---');
  } catch (error) {
    console.error('❌ 种子数据初始化失败:', error);
  } finally {
    await app.close();
  }
}

void bootstrap();
