import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';
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
        id: '16c21e67-d81a-4660-8488-8208479e0802',
        name: '超级管理员',
        code: 'R_SUPER',
        status: 1,
        sort: 1,
        remark: '拥有系统所有权限',
      });
      adminRole = await roleRepo.save(adminRole);
      console.log('✔ 已创建超级管理员角色');
    } else {
      const shouldUpdate =
        adminRole.name !== '超级管理员' ||
        adminRole.status !== 1 ||
        adminRole.sort !== 1 ||
        adminRole.remark !== '拥有系统所有权限';

      if (shouldUpdate) {
        adminRole.name = '超级管理员';
        adminRole.status = 1;
        adminRole.sort = 1;
        adminRole.remark = '拥有系统所有权限';
        adminRole = await roleRepo.save(adminRole);
      }
    }

    let userRole = await roleRepo.findOne({ where: { code: 'R_USER' } });
    if (!userRole) {
      userRole = roleRepo.create({
        id: '26c21e67-d81a-4660-8488-8208479e0802',
        name: '普通用户',
        code: 'R_USER',
        status: 1,
        sort: 2,
        remark: '拥有基础查看权限',
      });
      userRole = await roleRepo.save(userRole);
      console.log('✔ 已创建普通用户角色');
    } else {
      const shouldUpdate =
        userRole.name !== '普通用户' ||
        userRole.status !== 1 ||
        userRole.sort !== 2 ||
        userRole.remark !== '拥有基础查看权限';

      if (shouldUpdate) {
        userRole.name = '普通用户';
        userRole.status = 1;
        userRole.sort = 2;
        userRole.remark = '拥有基础查看权限';
        userRole = await roleRepo.save(userRole);
      }
    }

    // 2. 创建菜单
    const menuRepo = dataSource.getRepository(MenuEntity);

    // 清除旧菜单（可选，视需求而定，这里我们使用 upsert 逻辑）
    const menusData = [
      {
        id: '2159043e-7236-47a3-958b-9602e976662d',
        name: '仪表盘',
        path: '/home',
        component: 'layout.base$view.home',
        type: 2,
        icon: 'ic:round-home',
        status: 1,
        visible: 1,
        sort: 1,
      },
      {
        id: '4708796a-0466-4e55-9005-728795726260',
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
        id: '70636605-e95e-42e3-9568-7208479e0802',
        parentId: '4708796a-0466-4e55-9005-728795726260',
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
        id: '80636605-e95e-42e3-9568-7208479e0802',
        parentId: '4708796a-0466-4e55-9005-728795726260',
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
        id: '90636605-e95e-42e3-9568-7208479e0802',
        parentId: '4708796a-0466-4e55-9005-728795726260',
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
        id: 'b1a0e1a0-1a1a-4a1a-a1a1-a1a1a1a1a1a1',
        name: '用户新增',
        parentId: '70636605-e95e-42e3-9568-7208479e0802',
        type: 3,
        permission: 'sys:user:add',
        status: 1,
        visible: 1,
        sort: 1,
      },
      {
        id: 'b1a0e1a0-1a1a-4a1a-a1a1-a1a1a1a1a1a2',
        name: '用户编辑',
        parentId: '70636605-e95e-42e3-9568-7208479e0802',
        type: 3,
        permission: 'sys:user:edit',
        status: 1,
        visible: 1,
        sort: 2,
      },
      {
        id: 'b1a0e1a0-1a1a-4a1a-a1a1-a1a1a1a1a1a3',
        name: '用户删除',
        parentId: '70636605-e95e-42e3-9568-7208479e0802',
        type: 3,
        permission: 'sys:user:delete',
        status: 1,
        visible: 1,
        sort: 3,
      },
      {
        id: 'b1a0e1a0-1a1a-4a1a-a1a1-a1a1a1a1a1a4',
        name: '用户重置密码',
        parentId: '70636605-e95e-42e3-9568-7208479e0802',
        type: 3,
        permission: 'sys:user:reset',
        status: 1,
        visible: 1,
        sort: 4,
      },
      {
        id: 'b2a0e1a0-1a1a-4a1a-a1a1-a1a1a1a1a1a1',
        name: '角色新增',
        parentId: '80636605-e95e-42e3-9568-7208479e0802',
        type: 3,
        permission: 'sys:role:add',
        status: 1,
        visible: 1,
        sort: 1,
      },
      {
        id: 'b2a0e1a0-1a1a-4a1a-a1a1-a1a1a1a1a1a2',
        name: '角色编辑',
        parentId: '80636605-e95e-42e3-9568-7208479e0802',
        type: 3,
        permission: 'sys:role:edit',
        status: 1,
        visible: 1,
        sort: 2,
      },
      {
        id: 'b2a0e1a0-1a1a-4a1a-a1a1-a1a1a1a1a1a3',
        name: '角色删除',
        parentId: '80636605-e95e-42e3-9568-7208479e0802',
        type: 3,
        permission: 'sys:role:delete',
        status: 1,
        visible: 1,
        sort: 3,
      },
      {
        id: 'b2a0e1a0-1a1a-4a1a-a1a1-a1a1a1a1a1a4',
        name: '角色权限分配',
        parentId: '80636605-e95e-42e3-9568-7208479e0802',
        type: 3,
        permission: 'sys:role:assign',
        status: 1,
        visible: 1,
        sort: 4,
      },
      {
        id: 'b3a0e1a0-1a1a-4a1a-a1a1-a1a1a1a1a1a1',
        name: '菜单新增',
        parentId: '90636605-e95e-42e3-9568-7208479e0802',
        type: 3,
        permission: 'sys:menu:add',
        status: 1,
        visible: 1,
        sort: 1,
      },
      {
        id: 'b3a0e1a0-1a1a-4a1a-a1a1-a1a1a1a1a1a2',
        name: '菜单编辑',
        parentId: '90636605-e95e-42e3-9568-7208479e0802',
        type: 3,
        permission: 'sys:menu:edit',
        status: 1,
        visible: 1,
        sort: 2,
      },
      {
        id: 'b3a0e1a0-1a1a-4a1a-a1a1-a1a1a1a1a1a3',
        name: '菜单删除',
        parentId: '90636605-e95e-42e3-9568-7208479e0802',
        type: 3,
        permission: 'sys:menu:delete',
        status: 1,
        visible: 1,
        sort: 3,
      },
    ];

    for (const item of menusData) {
      let menu = await menuRepo.findOne({ where: { id: item.id } });
      if (!menu) {
        menu = menuRepo.create(item);
        await menuRepo.save(menu);
      } else {
        Object.assign(menu, item);
        await menuRepo.save(menu);
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
      const adminUser = userRepo.create({
        id: '561917f3-2b27-466e-9878-100220917637',
        username: 'admin',
        password: '$2b$10$fYf0aRBtNESDe60SqrLNIuWyKeGckytMkBMNUGwj/dCFQa7mkqSpS',
        nickname: '超级管理员',
        status: 1,
        roles: [adminRole],
      });
      await userRepo.save(adminUser);
      console.log('✔ 已创建超级管理员用户: admin / 123456');
    } else {
      const adminUser = await userRepo.findOne({ where: { username: 'admin' }, relations: ['roles'] });
      if (adminUser) {
        const existingRoleCodes = new Set(adminUser.roles?.map((r) => r.code) ?? []);
        if (!existingRoleCodes.has('R_SUPER')) {
          adminUser.roles = [...(adminUser.roles ?? []), adminRole];
        }
        if (adminUser.nickname !== '超级管理员') adminUser.nickname = '超级管理员';
        if (adminUser.status !== 1) adminUser.status = 1;
        await userRepo.save(adminUser);
      }
    }

    console.log('--- 种子数据初始化完成 ---');
  } catch (error) {
    console.error('❌ 种子数据初始化失败:', error);
  } finally {
    await app.close();
  }
}

void bootstrap();
