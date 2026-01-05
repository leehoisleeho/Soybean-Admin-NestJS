-- 创建数据库
CREATE DATABASE IF NOT EXISTS `soybean_admin` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

USE `soybean_admin`;

-- 1. 用户表 (sys_user) - 与 TypeORM 实体字段命名对齐
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

-- 2. 角色表 (sys_role) - 与 TypeORM 实体字段命名对齐
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

-- 4. 用户角色关联表 (sys_user_role) - 与 TypeORM JoinTable 结构对齐
CREATE TABLE IF NOT EXISTS `sys_user_role` (
  `user_id` CHAR(36) NOT NULL COMMENT '用户ID',
  `role_id` CHAR(36) NOT NULL COMMENT '角色ID',
  PRIMARY KEY (`user_id`, `role_id`),
  KEY `idx_role_id` (`role_id`),
  CONSTRAINT `fk_sys_user_role_user` FOREIGN KEY (`user_id`) REFERENCES `sys_user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_sys_user_role_role` FOREIGN KEY (`role_id`) REFERENCES `sys_role` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='用户角色关联表';

-- 5. 角色菜单关联表 (sys_role_menu) - 与 TypeORM JoinTable 结构对齐
CREATE TABLE IF NOT EXISTS `sys_role_menu` (
  `role_id` CHAR(36) NOT NULL COMMENT '角色ID',
  `menu_id` CHAR(36) NOT NULL COMMENT '菜单ID',
  PRIMARY KEY (`role_id`, `menu_id`),
  KEY `idx_menu_id` (`menu_id`),
  CONSTRAINT `fk_sys_role_menu_role` FOREIGN KEY (`role_id`) REFERENCES `sys_role` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_sys_role_menu_menu` FOREIGN KEY (`menu_id`) REFERENCES `sys_menu` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='角色菜单关联表';
