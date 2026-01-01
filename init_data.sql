-- 清理数据
DELETE FROM sys_role_menu;
DELETE FROM sys_user_role;
DELETE FROM sys_menu;
DELETE FROM sys_role;
DELETE FROM sys_user;

-- 插入超级管理员角色
INSERT INTO sys_role (id, name, code, status, sort, remark)
VALUES ('admin-role-id', '超级管理员', 'R_SUPER', 1, 1, '拥有所有权限');

-- 插入超级管理员用户 (密码是 123456 的 bcrypt 加密值)
-- $2a$10$7vNnK/NlUv.mP2f3R.9v.u6W5H5.k.2Y.Y.Y.Y.Y.Y.Y.Y.Y.Y.Y.Y
-- 注意：实际开发中请使用 AuthService.register 或 bcrypt.hash 生成
INSERT INTO sys_user (id, username, password, nickname, status)
VALUES ('admin-user-id', 'admin', '$2b$10$fYf0aRBtNESDe60SqrLNIuWyKeGckytMkBMNUGwj/dCFQa7mkqSpS', '超级管理员', 1);

-- 关联管理员用户和角色
INSERT INTO sys_user_role (id, user_id, role_id)
VALUES (UUID(), 'admin-user-id', 'admin-role-id');

-- 插入菜单数据
-- 系统管理目录
INSERT INTO sys_menu (id, parent_id, name, path, component, type, icon, status, visible, sort)
VALUES ('sys-manage-id', NULL, '系统管理', '/system', 'layout.base', 1, 'ic:round-settings', 1, 1, 10);

-- 用户管理菜单
INSERT INTO sys_menu (id, parent_id, name, path, component, type, icon, status, visible, sort)
VALUES ('sys-user-id', 'sys-manage-id', '用户管理', '/system/user', 'view.system_user', 2, 'ic:round-manage-accounts', 1, 1, 1);

-- 角色管理菜单
INSERT INTO sys_menu (id, parent_id, name, path, component, type, icon, status, visible, sort)
VALUES ('sys-role-id', 'sys-manage-id', '角色管理', '/system/role', 'view.system_role', 2, 'ic:round-person-search', 1, 1, 2);

-- 菜单管理菜单
INSERT INTO sys_menu (id, parent_id, name, path, component, type, icon, status, visible, sort)
VALUES ('sys-menu-id', 'sys-manage-id', '菜单管理', '/system/menu', 'view.system_menu', 2, 'ic:round-menu', 1, 1, 3);

-- 插入按钮权限
INSERT INTO sys_menu (id, parent_id, name, type, permission, status, visible, sort)
VALUES (UUID(), 'sys-user-id', '用户新增', 3, 'sys:user:add', 1, 1, 1);
INSERT INTO sys_menu (id, parent_id, name, type, permission, status, visible, sort)
VALUES (UUID(), 'sys-user-id', '用户编辑', 3, 'sys:user:edit', 1, 1, 2);
INSERT INTO sys_menu (id, parent_id, name, type, permission, status, visible, sort)
VALUES (UUID(), 'sys-user-id', '用户删除', 3, 'sys:user:delete', 1, 1, 3);

-- 关联角色和菜单
INSERT INTO sys_role_menu (id, role_id, menu_id)
SELECT UUID(), 'admin-role-id', id FROM sys_menu;
