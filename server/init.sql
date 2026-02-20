-- ============================================================
-- Soybean Admin 数据库初始化脚本（建表 + 种子数据）
-- 用法: mysql -u root -p < init.sql
-- 注意: 生产环境建议使用 pnpm run seed 代替本脚本
-- ============================================================

-- 创建数据库
CREATE DATABASE IF NOT EXISTS `soybean_admin` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

USE `soybean_admin`;

-- ============================================================
-- 第一部分：建表（DDL）
-- ============================================================

-- 1. 用户表 (sys_user)
CREATE TABLE IF NOT EXISTS `sys_user` (
  `id` CHAR(36) NOT NULL COMMENT '主键 UUID',
  `username` VARCHAR(50) NOT NULL COMMENT '用户名',
  `password` VARCHAR(255) NOT NULL COMMENT '密码',
  `nickname` VARCHAR(50) DEFAULT NULL COMMENT '昵称',
  `email` VARCHAR(100) DEFAULT NULL COMMENT '邮箱',
  `phone` VARCHAR(20) DEFAULT NULL COMMENT '手机号',
  `avatar` VARCHAR(255) DEFAULT NULL COMMENT '头像',
  `status` TINYINT(1) DEFAULT 1 COMMENT '状态(1:启用, 0:禁用)',
  `remark` VARCHAR(255) DEFAULT NULL COMMENT '备注',
  `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `deletedAt` DATETIME(6) DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_username` (`username`),
  KEY `idx_phone` (`phone`),
  KEY `idx_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='用户表';

-- 2. 角色表 (sys_role)
CREATE TABLE IF NOT EXISTS `sys_role` (
  `id` CHAR(36) NOT NULL COMMENT '主键 UUID',
  `name` VARCHAR(50) NOT NULL COMMENT '角色名称',
  `code` VARCHAR(50) NOT NULL COMMENT '角色编码',
  `status` TINYINT(1) DEFAULT 1 COMMENT '状态(1:启用, 0:禁用)',
  `sort` INT DEFAULT 0 COMMENT '显示排序',
  `remark` VARCHAR(255) DEFAULT NULL COMMENT '备注',
  `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `deletedAt` DATETIME(6) DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='角色表';

-- 3. 菜单表 (sys_menu)
CREATE TABLE IF NOT EXISTS `sys_menu` (
  `id` CHAR(36) NOT NULL COMMENT '主键 UUID',
  `parent_id` CHAR(36) DEFAULT NULL COMMENT '父菜单ID',
  `mpath` VARCHAR(255) DEFAULT NULL COMMENT '树形结构路径(materialized-path)',
  `name` VARCHAR(50) NOT NULL COMMENT '菜单名称',
  `path` VARCHAR(255) DEFAULT NULL COMMENT '路由路径',
  `component` VARCHAR(255) DEFAULT NULL COMMENT '组件路径',
  `redirect` VARCHAR(255) DEFAULT NULL COMMENT '重定向地址',
  `type` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '类型(1:目录, 2:菜单, 3:按钮)',
  `icon` VARCHAR(100) DEFAULT NULL COMMENT '图标',
  `permission` VARCHAR(100) DEFAULT NULL COMMENT '权限标识',
  `status` TINYINT(1) DEFAULT 1 COMMENT '状态(1:启用, 0:禁用)',
  `visible` TINYINT(1) DEFAULT 1 COMMENT '是否显示(1:是, 0:否)',
  `sort` INT DEFAULT 0 COMMENT '排序',
  `remark` VARCHAR(255) DEFAULT NULL COMMENT '备注',
  `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_parent_id` (`parent_id`),
  KEY `idx_mpath` (`mpath`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='菜单表';

-- 4. 用户角色关联表 (sys_user_role)
CREATE TABLE IF NOT EXISTS `sys_user_role` (
  `user_id` CHAR(36) NOT NULL COMMENT '用户ID',
  `role_id` CHAR(36) NOT NULL COMMENT '角色ID',
  PRIMARY KEY (`user_id`, `role_id`),
  KEY `idx_role_id` (`role_id`),
  CONSTRAINT `fk_sys_user_role_user` FOREIGN KEY (`user_id`) REFERENCES `sys_user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_sys_user_role_role` FOREIGN KEY (`role_id`) REFERENCES `sys_role` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='用户角色关联表';

-- 5. 角色菜单关联表 (sys_role_menu)
CREATE TABLE IF NOT EXISTS `sys_role_menu` (
  `role_id` CHAR(36) NOT NULL COMMENT '角色ID',
  `menu_id` CHAR(36) NOT NULL COMMENT '菜单ID',
  PRIMARY KEY (`role_id`, `menu_id`),
  KEY `idx_menu_id` (`menu_id`),
  CONSTRAINT `fk_sys_role_menu_role` FOREIGN KEY (`role_id`) REFERENCES `sys_role` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_sys_role_menu_menu` FOREIGN KEY (`menu_id`) REFERENCES `sys_menu` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='角色菜单关联表';

-- ============================================================
-- 第二部分：种子数据（DML）
-- ============================================================

-- 清理旧数据（按依赖顺序 DELETE，避免外键冲突）
DELETE FROM sys_user_role;
DELETE FROM sys_role_menu;
DELETE FROM sys_menu;
DELETE FROM sys_user;
DELETE FROM sys_role;

-- 1. 插入角色
INSERT INTO sys_role (id, name, code, status, sort, remark)
VALUES ('16c21e67-d81a-4660-8488-8208479e0802', '超级管理员', 'R_SUPER', 1, 1, '拥有所有权限');

INSERT INTO sys_role (id, name, code, status, sort, remark)
VALUES ('26c21e67-d81a-4660-8488-8208479e0802', '普通用户', 'R_USER', 1, 2, '拥有基础查看权限');

-- 2. 插入管理员用户 (用户名: admin, 密码: 123456)
INSERT INTO sys_user (id, username, password, nickname, status)
VALUES ('561917f3-2b27-466e-9878-100220917637', 'admin', '$2b$10$fYf0aRBtNESDe60SqrLNIuWyKeGckytMkBMNUGwj/dCFQa7mkqSpS', '超级管理员', 1);

-- 3. 关联用户和角色
INSERT INTO sys_user_role (user_id, role_id)
VALUES ('561917f3-2b27-466e-9878-100220917637', '16c21e67-d81a-4660-8488-8208479e0802');

-- 4. 插入菜单数据
INSERT INTO sys_menu (id, parent_id, name, path, component, type, icon, status, visible, sort)
VALUES ('2159043e-7236-47a3-958b-9602e976662d', NULL, '仪表盘', '/home', 'layout.base$view.home', 2, 'ic:round-home', 1, 1, 1);

INSERT INTO sys_menu (id, parent_id, name, path, component, type, icon, status, visible, sort)
VALUES ('4708796a-0466-4e55-9005-728795726260', NULL, '系统管理', '/system', 'layout.base', 1, 'ic:round-settings', 1, 1, 10);

INSERT INTO sys_menu (id, parent_id, name, path, component, type, icon, status, visible, sort)
VALUES ('70636605-e95e-42e3-9568-7208479e0802', '4708796a-0466-4e55-9005-728795726260', '用户管理', '/system/user', 'view.system_user', 2, 'ic:round-manage-accounts', 1, 1, 1);

INSERT INTO sys_menu (id, parent_id, name, type, permission, status, visible, sort) VALUES
('b1a0e1a0-1a1a-4a1a-a1a1-a1a1a1a1a1a1', '70636605-e95e-42e3-9568-7208479e0802', '用户新增', 3, 'sys:user:add', 1, 1, 1),
('b1a0e1a0-1a1a-4a1a-a1a1-a1a1a1a1a1a2', '70636605-e95e-42e3-9568-7208479e0802', '用户编辑', 3, 'sys:user:edit', 1, 1, 2),
('b1a0e1a0-1a1a-4a1a-a1a1-a1a1a1a1a1a3', '70636605-e95e-42e3-9568-7208479e0802', '用户删除', 3, 'sys:user:delete', 1, 1, 3),
('b1a0e1a0-1a1a-4a1a-a1a1-a1a1a1a1a1a4', '70636605-e95e-42e3-9568-7208479e0802', '用户重置密码', 3, 'sys:user:reset', 1, 1, 4);

INSERT INTO sys_menu (id, parent_id, name, path, component, type, icon, status, visible, sort)
VALUES ('80636605-e95e-42e3-9568-7208479e0802', '4708796a-0466-4e55-9005-728795726260', '角色管理', '/system/role', 'view.system_role', 2, 'ic:round-person-search', 1, 1, 2);

INSERT INTO sys_menu (id, parent_id, name, type, permission, status, visible, sort) VALUES
('b2a0e1a0-1a1a-4a1a-a1a1-a1a1a1a1a1a1', '80636605-e95e-42e3-9568-7208479e0802', '角色新增', 3, 'sys:role:add', 1, 1, 1),
('b2a0e1a0-1a1a-4a1a-a1a1-a1a1a1a1a1a2', '80636605-e95e-42e3-9568-7208479e0802', '角色编辑', 3, 'sys:role:edit', 1, 1, 2),
('b2a0e1a0-1a1a-4a1a-a1a1-a1a1a1a1a1a3', '80636605-e95e-42e3-9568-7208479e0802', '角色删除', 3, 'sys:role:delete', 1, 1, 3),
('b2a0e1a0-1a1a-4a1a-a1a1-a1a1a1a1a1a4', '80636605-e95e-42e3-9568-7208479e0802', '角色权限分配', 3, 'sys:role:assign', 1, 1, 4);

INSERT INTO sys_menu (id, parent_id, name, path, component, type, icon, status, visible, sort)
VALUES ('90636605-e95e-42e3-9568-7208479e0802', '4708796a-0466-4e55-9005-728795726260', '菜单管理', '/system/menu', 'view.system_menu', 2, 'ic:round-menu', 1, 1, 3);

INSERT INTO sys_menu (id, parent_id, name, type, permission, status, visible, sort) VALUES
('b3a0e1a0-1a1a-4a1a-a1a1-a1a1a1a1a1a1', '90636605-e95e-42e3-9568-7208479e0802', '菜单新增', 3, 'sys:menu:add', 1, 1, 1),
('b3a0e1a0-1a1a-4a1a-a1a1-a1a1a1a1a1a2', '90636605-e95e-42e3-9568-7208479e0802', '菜单编辑', 3, 'sys:menu:edit', 1, 1, 2),
('b3a0e1a0-1a1a-4a1a-a1a1-a1a1a1a1a1a3', '90636605-e95e-42e3-9568-7208479e0802', '菜单删除', 3, 'sys:menu:delete', 1, 1, 3);

-- 5. 超级管理员关联所有菜单
INSERT INTO sys_role_menu (role_id, menu_id)
SELECT '16c21e67-d81a-4660-8488-8208479e0802', id FROM sys_menu;
