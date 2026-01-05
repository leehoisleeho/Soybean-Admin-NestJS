-- 指定使用的数据库
USE soybean_admin;

-- 1. 清理所有旧数据
-- 注意：MySQL 在存在外键引用时不允许 TRUNCATE 被引用的表，即使关闭 FOREIGN_KEY_CHECKS 也可能报错；
-- 因此这里改为按依赖顺序 DELETE
DELETE FROM sys_user_role;
DELETE FROM sys_role_menu;
DELETE FROM sys_menu;
DELETE FROM sys_user;
DELETE FROM sys_role;

-- 2. 插入超级管理员角色 (code 必须是 R_SUPER)
INSERT INTO sys_role (id, name, code, status, sort, remark)
VALUES ('16c21e67-d81a-4660-8488-8208479e0802', '超级管理员', 'R_SUPER', 1, 1, '拥有所有权限');

-- 插入普通用户角色
INSERT INTO sys_role (id, name, code, status, sort, remark)
VALUES ('26c21e67-d81a-4660-8488-8208479e0802', '普通用户', 'R_USER', 1, 2, '拥有基础查看权限');

-- 3. 插入超级管理员用户 (用户名: admin, 密码: 123456)
-- 密码哈希对应 123456: $2b$10$fYf0aRBtNESDe60SqrLNIuWyKeGckytMkBMNUGwj/dCFQa7mkqSpS
INSERT INTO sys_user (id, username, password, nickname, status)
VALUES ('561917f3-2b27-466e-9878-100220917637', 'admin', '$2b$10$fYf0aRBtNESDe60SqrLNIuWyKeGckytMkBMNUGwj/dCFQa7mkqSpS', '超级管理员', 1);

-- 4. 关联用户和角色
INSERT INTO sys_user_role (user_id, role_id) 
VALUES ('561917f3-2b27-466e-9878-100220917637', '16c21e67-d81a-4660-8488-8208479e0802');

-- 5. 插入菜单数据
-- 仪表盘
INSERT INTO sys_menu (id, parent_id, name, path, component, type, icon, status, visible, sort)
VALUES ('2159043e-7236-47a3-958b-9602e976662d', NULL, '仪表盘', '/home', 'layout.base$view.home', 2, 'ic:round-home', 1, 1, 1);

-- 系统管理 (目录)
INSERT INTO sys_menu (id, parent_id, name, path, component, type, icon, status, visible, sort)
VALUES ('4708796a-0466-4e55-9005-728795726260', NULL, '系统管理', '/system', 'layout.base', 1, 'ic:round-settings', 1, 1, 10);

-- 用户管理 (菜单)
INSERT INTO sys_menu (id, parent_id, name, path, component, type, icon, status, visible, sort)
VALUES ('70636605-e95e-42e3-9568-7208479e0802', '4708796a-0466-4e55-9005-728795726260', '用户管理', '/system/user', 'view.system_user', 2, 'ic:round-manage-accounts', 1, 1, 1);

-- 用户管理 按钮
INSERT INTO sys_menu (id, parent_id, name, type, permission, status, visible, sort) VALUES 
('b1a0e1a0-1a1a-4a1a-a1a1-a1a1a1a1a1a1', '70636605-e95e-42e3-9568-7208479e0802', '用户新增', 3, 'sys:user:add', 1, 1, 1),
('b1a0e1a0-1a1a-4a1a-a1a1-a1a1a1a1a1a2', '70636605-e95e-42e3-9568-7208479e0802', '用户编辑', 3, 'sys:user:edit', 1, 1, 2),
('b1a0e1a0-1a1a-4a1a-a1a1-a1a1a1a1a1a3', '70636605-e95e-42e3-9568-7208479e0802', '用户删除', 3, 'sys:user:delete', 1, 1, 3),
('b1a0e1a0-1a1a-4a1a-a1a1-a1a1a1a1a1a4', '70636605-e95e-42e3-9568-7208479e0802', '用户重置密码', 3, 'sys:user:reset', 1, 1, 4);

-- 角色管理 (菜单)
INSERT INTO sys_menu (id, parent_id, name, path, component, type, icon, status, visible, sort)
VALUES ('80636605-e95e-42e3-9568-7208479e0802', '4708796a-0466-4e55-9005-728795726260', '角色管理', '/system/role', 'view.system_role', 2, 'ic:round-person-search', 1, 1, 2);

-- 角色管理 按钮
INSERT INTO sys_menu (id, parent_id, name, type, permission, status, visible, sort) VALUES 
('b2a0e1a0-1a1a-4a1a-a1a1-a1a1a1a1a1a1', '80636605-e95e-42e3-9568-7208479e0802', '角色新增', 3, 'sys:role:add', 1, 1, 1),
('b2a0e1a0-1a1a-4a1a-a1a1-a1a1a1a1a1a2', '80636605-e95e-42e3-9568-7208479e0802', '角色编辑', 3, 'sys:role:edit', 1, 1, 2),
('b2a0e1a0-1a1a-4a1a-a1a1-a1a1a1a1a1a3', '80636605-e95e-42e3-9568-7208479e0802', '角色删除', 3, 'sys:role:delete', 1, 1, 3),
('b2a0e1a0-1a1a-4a1a-a1a1-a1a1a1a1a1a4', '80636605-e95e-42e3-9568-7208479e0802', '角色权限分配', 3, 'sys:role:assign', 1, 1, 4);

-- 菜单管理 (菜单)
INSERT INTO sys_menu (id, parent_id, name, path, component, type, icon, status, visible, sort)
VALUES ('90636605-e95e-42e3-9568-7208479e0802', '4708796a-0466-4e55-9005-728795726260', '菜单管理', '/system/menu', 'view.system_menu', 2, 'ic:round-menu', 1, 1, 3);

-- 菜单管理 按钮
INSERT INTO sys_menu (id, parent_id, name, type, permission, status, visible, sort) VALUES 
('b3a0e1a0-1a1a-4a1a-a1a1-a1a1a1a1a1a1', '90636605-e95e-42e3-9568-7208479e0802', '菜单新增', 3, 'sys:menu:add', 1, 1, 1),
('b3a0e1a0-1a1a-4a1a-a1a1-a1a1a1a1a1a2', '90636605-e95e-42e3-9568-7208479e0802', '菜单编辑', 3, 'sys:menu:edit', 1, 1, 2),
('b3a0e1a0-1a1a-4a1a-a1a1-a1a1a1a1a1a3', '90636605-e95e-42e3-9568-7208479e0802', '菜单删除', 3, 'sys:menu:delete', 1, 1, 3);

-- 6. 关联角色和菜单
INSERT INTO sys_role_menu (role_id, menu_id)
SELECT '16c21e67-d81a-4660-8488-8208479e0802', id FROM sys_menu;
