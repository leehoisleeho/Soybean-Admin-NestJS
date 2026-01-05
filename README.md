<div align="center">
  <img alt="Soybean Admin" src="./soybean-admin-frontend/src/assets/imgs/logo.png" width="100">
  <h1>Soybean Admin NestJS</h1>
  <p>基于 <b>Soybean Admin</b> 与 <b>NestJS</b> 构建的全栈后台管理系统</p>

  <p>
    <img src="https://img.shields.io/badge/version-v0.9.0-blue.svg" alt="version">
    <img src="https://img.shields.io/badge/Vue-3.x-4fc08d.svg?logo=vue.js" alt="vue">
    <img src="https://img.shields.io/badge/NestJS-11.x-E0234E.svg?logo=nestjs" alt="nestjs">
    <img src="https://img.shields.io/badge/TypeScript-5.x-3178c6.svg?logo=typescript" alt="typescript">
    <img src="https://img.shields.io/badge/pnpm-10.x-f69220.svg?logo=pnpm" alt="pnpm">
    <img src="https://img.shields.io/badge/MySQL-8.0-4479A1.svg?logo=mysql" alt="mysql">
  </p>
</div>

---

## 📖 简介

本仓库是一个基于 **Soybean Admin** 前端模版与 **NestJS** 后端框架构建的全栈后台管理系统。它结合了 Vue3 的优雅前端与 NestJS 的强大后端架构，为您提供开箱即用的后台管理方案。

> [!IMPORTANT]
> **注意**：本项目强制要求使用 **pnpm** 管理依赖。请勿使用 npm 或 yarn。

- **前端**：`soybean-admin-frontend` (Vue3 + Vite + TypeScript)
- **后端**：`soybean-admin-backend` (NestJS + TypeORM + MySQL + JWT)

## 📦 目录结构

```text
.
├── soybean-admin-frontend/   # 前端项目 (Vite dev 默认 9527)
├── soybean-admin-backend/    # 后端项目 (Nest dev 默认 3000, API 前缀 /api)
└── init_data.sql             # 可选：SQL 方式初始化基础数据
```

## 🛠️ 环境要求

- **Node.js**: >= 20
- **pnpm**: >= 10.5.0 (强制要求)
- **MySQL**: >= 8.0

---

## 🚀 快速开始（推荐：Seed 脚本初始化）

### 1) 启动并准备数据库

确保 MySQL 已启动，并创建数据库（默认库名：`soybean_admin`）。

```sql
CREATE DATABASE IF NOT EXISTS `soybean_admin` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
```

### 2) 启动后端

进入后端目录并安装依赖：

```bash
cd soybean-admin-backend
pnpm install
```

配置后端环境变量（编辑 `soybean-admin-backend/.env`）：

```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=soybean_admin

JWT_SECRET=soybean_admin_secret
JWT_EXPIRES_IN=7d
```

初始化基础数据（写入角色、菜单、管理员账号等）：

```bash
pnpm run seed
```

启动后端：

```bash
pnpm run start:dev
```

- **API 地址**: `http://localhost:3000/api`
- **Swagger 文档**: `http://localhost:3000/api-docs`

### 3) 启动前端

进入前端目录并安装依赖：

```bash
cd ../soybean-admin-frontend
pnpm install
```

确认配置（`.env.development`）：
- `VITE_SERVICE_BASE_URL=http://localhost:3000/api`

启动前端：

```bash
pnpm dev
```

- **访问地址**: `http://localhost:9527/`

---

## 📝 常用命令汇总

| 任务 | 后端 (soybean-admin-backend) | 前端 (soybean-admin-frontend) |
| :--- | :--- | :--- |
| **安装依赖** | `pnpm install` | `pnpm install` |
| **启动开发服务** | `pnpm run start:dev` | `pnpm dev` |
| **项目打包** | `pnpm run build` | `pnpm build` |
| **数据库种子** | `pnpm run seed` | - |

## 🔑 默认账号

- **用户名**：`admin`
- **密码**：`123456`

---

## ⚙️ 初始化数据说明

### 方式 1：后端 Seed (推荐)

在 `soybean-admin-backend` 目录下执行：`pnpm run seed`

脚本会创建：
- **角色**：`R_SUPER` (超级管理员)、`R_USER` (普通用户)
- **菜单**：系统管理、用户管理、角色管理、菜单管理等
- **管理员**：`admin / 123456`

### 方式 2：SQL 初始化 (可选)

1. 执行后端脚本：`soybean-admin-backend/init.sql`
2. 执行根目录数据脚本：`init_data.sql`

---

## ❓ 常见问题

### 1) 登录后看不到菜单
- 确认已执行 `pnpm run seed` 初始化数据。
- 确认前端 `.env` 中 `VITE_AUTH_ROUTE_MODE=dynamic`。

### 2) 前端请求后端失败
- 确认 `VITE_SERVICE_BASE_URL` 配置正确。
- 确认后端已正常启动。

---

## 🏗️ 线上部署

### 1. 后端部署 (NestJS)

**建议上传的文件清单：**
- `soybean-admin-backend/dist/` (构建后的 JS 文件)
- `soybean-admin-backend/package.json`
- `soybean-admin-backend/pnpm-lock.yaml`
- `soybean-admin-backend/.env` (生产环境配置)

**部署步骤：**
1. **环境准备**：确保服务器已安装 Node.js (>=20), MySQL (>=8.0), PM2。
2. **上传文件**：将上述清单中的文件上传至服务器后端目录。
3. **安装生产依赖**：
   ```bash
   pnpm install --prod
   ```
4. **启动服务**：
   ```bash
   pm2 start dist/main.js --name soybean-backend
   ```

### 2. 前端部署 (Vue3)

**建议上传的文件清单：**
- `soybean-admin-frontend/dist/` (静态资源文件)

**部署步骤：**
1. **构建项目**：在本地执行 `pnpm build`。
2. **上传文件**：将 `dist` 目录内的所有文件上传至 Nginx 指定的静态资源目录。
3. **Nginx 配置**：配置 Nginx 托管静态文件并转发 API 请求。
   
   示例 Nginx 配置：
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           root /path/to/soybean-admin-frontend/dist;
           index index.html;
           try_files $uri $uri/ /index.html;
       }

       location /api/ {
           proxy_pass http://localhost:3000/api/;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       }
    }
    ```

### 3. 注意事项
- 确保服务器安全组/防火墙已开放 80, 443 (前端) 和 3000 (后端，如果通过 Nginx 转发则可不开放) 端口。
- 生产环境下 `NODE_ENV` 应设置为 `production`。
- 建议配置 SSL 证书以启用 HTTPS。

---
