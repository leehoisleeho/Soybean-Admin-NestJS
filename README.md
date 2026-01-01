# Soybean Admin NestJS (soybean-admin-nestjs)

本仓库是一个基于 **Soybean Admin** 前端模版与 **NestJS** 后端框架构建的全栈后台管理系统。

> **注意**：本项目强制要求使用 **pnpm** 管理依赖。请勿使用 npm 或 yarn。

- 前端：`soybean-admin-frontend`（Vue3 + Vite + TypeScript，基于 SoybeanAdmin）
- 后端：`soybean-admin-backend`（NestJS + TypeORM + MySQL + JWT）

## 目录结构

```text
.
├── soybean-admin-frontend/   # 前端项目（Vite dev 默认 9527）
├── soybean-admin-backend/    # 后端项目（Nest dev 默认 3000，API 前缀 /api）
└── init_data.sql             # 可选：SQL 方式初始化基础数据
```

## 环境要求

- Node.js >= 20
- **pnpm >= 9** (强制要求：前端和后端均须使用 pnpm 安装依赖)
- MySQL >= 8.0

## 快速开始（推荐：Seed 脚本初始化）

### 1) 启动并准备数据库

确保 MySQL 已启动，并创建数据库（默认库名：`soybean_admin`）。

你可以用两种方式创建库：

- 方式 A：手动创建空库
  ```sql
  CREATE DATABASE IF NOT EXISTS `soybean_admin` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
  ```
- 方式 B：执行后端自带建表脚本（会创建库与表结构）
  - 文件：`soybean-admin-backend/init.sql`

### 2) 启动后端

进入后端目录并安装依赖：

```bash
cd soybean-admin-backend
pnpm install
```

配置后端环境变量（直接编辑 `soybean-admin-backend/.env`）：

```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=123456
DB_NAME=soybean_admin

JWT_SECRET=soybean_admin_secret
JWT_EXPIRES_IN=7d
```

初始化基础数据（会写入角色、菜单、管理员账号等）：

```bash
pnpm run seed
```

启动后端：

```bash
pnpm run start:dev
```

后端地址：

- API：`http://localhost:3000/api`
- Swagger：`http://localhost:3000/api-docs`

### 3) 启动前端

进入前端目录并安装依赖：

```bash
cd ../soybean-admin-frontend
pnpm install
```

确认前端后端地址配置：

- 开发环境：`soybean-admin-frontend/.env.development`
  - 默认已配置为：`VITE_SERVICE_BASE_URL=http://localhost:3000/api`
- 开发代理：`soybean-admin-frontend/.env`
  - 默认 `VITE_HTTP_PROXY=Y`，前端会通过 Vite 代理转发请求到 `VITE_SERVICE_BASE_URL`

启动前端：

```bash
pnpm dev
```

## 常用命令汇总

| 任务 | 后端 (soybean-admin-backend) | 前端 (soybean-admin-frontend) |
| :--- | :--- | :--- |
| **安装依赖** | `pnpm install` | `pnpm install` |
| **启动开发服务** | `pnpm run start:dev` | `pnpm dev` |
| **项目打包** | `pnpm run build` | `pnpm build` |
| **数据库种子** | `pnpm run seed` | - |

访问地址（默认）：

- `http://localhost:9527/`

### 4) 默认账号

- 用户名：`admin`
- 密码：`123456`

## 初始化数据说明

本项目提供两种初始化方式，任选其一：

### 方式 1：后端 Seed（推荐）

命令：`soybean-admin-backend` 目录下执行：

```bash
pnpm run seed
```

说明：

- Seed 脚本入口：`soybean-admin-backend/src/database/seeds/seed.ts`
- 脚本会创建/补齐：
  - 角色：`R_SUPER`（超级管理员）、`R_USER`（普通用户）
  - 菜单：系统管理/用户管理/角色管理/菜单管理等（并为超级管理员绑定所有菜单）
  - 管理员用户：`admin / 123456`
- 若 `NODE_ENV=development`，后端 TypeORM 会自动同步表结构（无需手动建表）

### 方式 2：SQL 初始化（可选）

适合你不想使用 TypeORM 自动同步，或希望用 SQL 快速落库时使用。

1. 执行建库建表脚本：
   - `soybean-admin-backend/init.sql`
2. 执行基础数据脚本：
   - 根目录：`init_data.sql`

注意：

- `init_data.sql` 会清理并重建基础数据（包含管理员账号与菜单/权限关联）。

## 常见问题

### 1) 登录后看不到菜单

- 确认已执行初始化：推荐执行 `pnpm run seed`
- 确认前端为动态路由模式：`soybean-admin-frontend/.env` 中 `VITE_AUTH_ROUTE_MODE=dynamic`

### 2) 前端请求后端失败（CORS/代理）

- 开发环境默认启用代理：`VITE_HTTP_PROXY=Y`
- 确认 `soybean-admin-frontend/.env.development` 中 `VITE_SERVICE_BASE_URL` 指向正确的后端地址（默认应为 `http://localhost:3000/api`）

## 生产构建

后端：

```bash
cd soybean-admin-backend
pnpm run build
pnpm run start:prod
```

前端：

```bash
cd soybean-admin-frontend
pnpm build
```

将 `soybean-admin-frontend/dist` 部署到任意静态资源服务器，并在生产环境中把 `VITE_SERVICE_BASE_URL` 配置为线上后端地址（见 `soybean-admin-frontend/.env.prod`）。

