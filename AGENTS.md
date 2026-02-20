# AGENTS.md - AI 开发指南

> 本文件是 AI 编码助手的项目级指令。每次对话开始时自动加载。
> 详细项目文档见 [PROJECT.md](./PROJECT.md)

**重要规则：当你对项目的业务逻辑、数据模型、API 设计、权限体系、模块关系等有任何不确定时，必须先阅读 [PROJECT.md](./PROJECT.md) 获取完整上下文，再进行开发。不要凭猜测写代码。**

---

## 项目概述

全栈后台管理系统，RBAC 权限模型（用户→角色→菜单/按钮）。

| 端 | 技术栈 | 目录 | 端口 |
|----|--------|------|------|
| 后端 | NestJS 11 + TypeORM + MySQL 8 + JWT | `server/` | 3000 |
| 前端 | Vue 3.5 + Vite 7 + NaiveUI + Pinia + UnoCSS | `soybean-admin/` | 9527 |

- 包管理器: **pnpm**（强制，禁止 npm/yarn）
- API 前缀: `/api`
- 成功响应码: `"0000"`
- 未授权响应码: `"8888"`（前端自动登出）

---

## 架构约定

### 后端模块结构

每个业务模块遵循以下结构：

```
src/modules/{模块名}/
├── {模块名}.module.ts        # 模块定义（注册 Entity、Controller、Service）
├── {模块名}.controller.ts    # 路由层（装饰器定义 API 端点）
├── {模块名}.service.ts       # 业务逻辑层
└── dto/
    ├── create-{模块名}.dto.ts   # 创建 DTO
    ├── update-{模块名}.dto.ts   # 更新 DTO（extends PartialType(CreateDto)）
    └── query-{模块名}.dto.ts    # 查询 DTO（分页、搜索参数）
```

实体统一放在 `src/entities/{名称}.entity.ts`，不放在模块内部。

### 前端模块结构

```
src/views/{模块路径}/
├── index.vue                    # 页面主组件（表格 + 搜索 + 操作）
└── components/
    ├── {模块名}-modal.vue       # 新增/编辑弹窗
    └── 其他子组件.vue

src/service/api/{模块名}.ts      # API 请求函数
src/store/modules/{模块名}/      # Pinia Store（如需要）
src/typings/api/{模块名}.d.ts    # 类型定义
```

---

## 命名规范

### 后端

| 类型 | 规范 | 示例 |
|------|------|------|
| 实体类 | PascalCase + `Entity` 后缀 | `UserEntity`, `RoleEntity` |
| 实体文件 | kebab-case + `.entity.ts` | `user.entity.ts` |
| 数据库表名 | snake_case + `sys_` 前缀 | `sys_user`, `sys_role` |
| Controller | PascalCase + `Controller` 后缀 | `UserController` |
| Service | PascalCase + `Service` 后缀 | `UserService` |
| DTO | PascalCase + `Dto` 后缀 | `CreateUserDto`, `QueryUserDto` |
| 路由路径 | 小写单数名词 | `@Controller('user')` |
| 权限标识 | `模块:资源:操作` | `sys:user:add`, `sys:role:edit` |
| 角色编码 | `R_` 前缀 + 大写 | `R_SUPER`, `R_USER` |

### 前端

| 类型 | 规范 | 示例 |
|------|------|------|
| 组件文件 | kebab-case `.vue` | `user-modal.vue` |
| API 函数 | `fetch` 前缀 + PascalCase | `fetchUserList`, `fetchCreateUser` |
| Store | `use` 前缀 + `Store` 后缀 | `useAuthStore`, `useRouteStore` |
| 类型命名空间 | `Api.{模块}.{类型}` | `Api.SystemManage.User` |

---

## 代码规范

### 后端

- Prettier: 单引号 `singleQuote: true`，尾逗号 `trailingComma: "all"`
- TypeScript: `strictNullChecks: true`, `noImplicitAny: false`
- 所有实体主键使用 UUID: `@PrimaryGeneratedColumn('uuid')`
- 软删除使用 `@DeleteDateColumn` + `softRemove()`（菜单除外，菜单为物理删除）
- 密码加密: `bcrypt.hash(password, 10)`
- 密码字段安全: 实体使用 `select: false`，查询默认不返回密码，需要密码时使用 `addSelect('user.password')`
- 统一响应格式由 `TransformInterceptor` 自动包装，Controller 直接返回数据即可
- 异常处理由 `HttpExceptionFilter` 统一处理，业务层直接 `throw new NotFoundException()` 等
- 分页响应格式: `{ records, total, current, size }`
- 每个 DTO 必须使用 `class-validator` 装饰器验证
- 每个 DTO 字段必须添加 `@ApiProperty()` Swagger 文档

### 前端

- ESLint: `@soybeanjs/eslint-config`
- 路由: Elegant Router 自动生成，不手动编辑 `router/elegant/` 下的文件
- HTTP 请求: 使用 `@sa/axios` 封装的 `request` 函数（`createFlatRequest`）
- 请求函数自动解包 `response.data.data`，API 函数直接拿到业务数据
- 表格: 使用 `useNaivePaginatedTable`（分页）或 `useNaiveTable`（不分页）Hook
- 表格操作: 使用 `useTableOperate` Hook
- 国际化: 所有用户可见文本使用 `$t('key')` 而非硬编码中文

---

## 权限体系

```
用户 (sys_user)
  ↓ ManyToMany (sys_user_role)
角色 (sys_role)
  ↓ ManyToMany (sys_role_menu)
菜单 (sys_menu)
  └── type=3 的按钮 → permission 字段 = 权限标识
```

- 超级管理员 `R_SUPER` 跳过所有权限检查
- 后端权限守卫: `@UseGuards(JwtAuthGuard, PermissionsGuard)` + `@RequirePermissions('sys:xxx:xxx')`
- 已启用权限守卫的模块: user、role、menu（写操作需要对应权限，查询操作仅需 JWT 认证）
- route 模块: 所有接口需要 JWT 认证（类级别 JwtAuthGuard）
- auth 模块: login/register/refreshToken 为公开接口，其余需要 JWT 认证
- 前端按钮权限: 通过 `getUserInfo` 返回的 `buttons[]` 数组控制

---

## 新模块开发步骤

### 后端（以 `department` 部门模块为例）

1. **创建实体** `src/entities/department.entity.ts`
   - 表名 `sys_department`，主键 UUID
   - 添加 `@ApiProperty()` 和 `class-validator` 装饰器
   - 定义关联关系

2. **创建 DTO** `src/modules/department/dto/`
   - `create-department.dto.ts` — 创建参数，必填字段加 `@IsNotEmpty()`
   - `update-department.dto.ts` — `extends PartialType(CreateDepartmentDto)`
   - `query-department.dto.ts` — 分页参数 `page`, `pageSize` + 搜索字段

3. **创建 Service** `src/modules/department/department.service.ts`
   - 注入 `@InjectRepository(DepartmentEntity)`
   - 实现 CRUD + 分页查询
   - 分页返回格式: `{ records, total, current, size }`

4. **创建 Controller** `src/modules/department/department.controller.ts`
   - `@ApiTags('部门管理')` + `@ApiBearerAuth()` + `@UseGuards(JwtAuthGuard, PermissionsGuard)`
   - 每个方法加 `@ApiOperation({ summary: '...' })`
   - 需要权限的操作加 `@RequirePermissions('sys:department:add')`

5. **创建 Module** `src/modules/department/department.module.ts`
   - `TypeOrmModule.forFeature([DepartmentEntity])`
   - 导出 Service（如其他模块需要）

6. **注册模块** 在 `app.module.ts` 的 `imports` 中添加 `DepartmentModule`

7. **添加种子数据** 在 `database/seeds/seed.ts` 中添加对应菜单和按钮权限

### 前端

1. **添加类型定义** `src/typings/api/department.d.ts`
   - 在 `Api.SystemManage` 命名空间下定义接口

2. **添加 API 函数** `src/service/api/department.ts`
   - 使用 `request` 函数封装所有 CRUD 接口
   - 函数命名: `fetchDepartmentList`, `fetchCreateDepartment` 等

3. **创建页面** `src/views/system/department/`
   - `index.vue` — 表格页面（参考 `user/index.vue`）
   - `components/department-modal.vue` — 新增/编辑弹窗

4. **添加路由** — Elegant Router 会根据 `views/` 目录自动生成路由

5. **添加菜单** — 在后端种子数据或菜单管理页面中添加菜单项
   - 目录/菜单的 `component` 格式: `view.system_department`
   - 按钮的 `permission` 格式: `sys:department:add`

6. **添加国际化** — 在 `src/locales/` 中添加对应的翻译 key

---

## 前后端联调规范

### 响应格式

后端 `TransformInterceptor` 自动包装所有响应:

```json
// 成功
{ "code": "0000", "data": { ... }, "msg": "success" }

// 失败（HttpException）
{ "code": "状态码", "data": null, "msg": "错误信息" }

// 未授权（401）
{ "code": "8888", "data": null, "msg": "Unauthorized" }
```

前端 `request` 函数自动解包，API 函数直接返回 `data` 部分。

### 分页接口约定

- 请求参数: `{ page: number, pageSize: number, ...搜索字段 }`
- 响应数据: `{ records: T[], total: number, current: number, size: number }`

### 新增接口联调检查清单

- [ ] 后端 Controller 添加了 `@ApiOperation` 和 `@ApiTags`
- [ ] 后端 DTO 添加了 `@ApiProperty` 和验证装饰器
- [ ] 后端 DTO 启用了 `whitelist: true`（全局 ValidationPipe 已配置）
- [ ] 前端 API 函数参数与后端 DTO 字段一致
- [ ] 前端处理了空值/undefined（发送前清理无效参数）
- [ ] 需要权限的接口添加了 `@RequirePermissions` 装饰器
- [ ] 对应的菜单按钮权限已在种子数据中注册

---

## 代码审查要点

### 安全

- [ ] 密码字段不出现在 API 响应中（实体使用 `select: false`，新增/重置密码后手动排除）
- [ ] 敏感操作使用 `@RequirePermissions` 保护
- [ ] 用户输入通过 DTO + class-validator 验证
- [ ] 不使用 `@ts-ignore` 或 `as any` 绕过类型检查
- [ ] 删除关联实体前检查依赖关系（如删除角色前检查用户关联）

### 数据库

- [ ] 新实体使用 UUID 主键
- [ ] 关联关系正确定义（JoinTable 在拥有方）
- [ ] 删除操作使用软删除（除菜单外）
- [ ] 查询使用 TypeORM QueryBuilder 或 Repository API，不写原生 SQL

### API 设计

- [ ] RESTful 风格: GET 查询、POST 创建、PATCH 更新、DELETE 删除
- [ ] 分页接口返回 `{ records, total, current, size }` 格式
- [ ] 批量操作路径: `DELETE /xxx/batch`，Body: `{ ids: string[] }`
- [ ] 状态切换路径: `PATCH /xxx/:id/status`

### 前端

- [ ] 用户可见文本使用 `$t()` 国际化
- [ ] 表格使用 `useNaivePaginatedTable` / `useNaiveTable` Hook
- [ ] API 函数在发送前清理空字符串和 undefined 参数
- [ ] 删除操作使用 `NPopconfirm` 二次确认

---

## 常用命令

| 操作 | 后端 | 前端 |
|------|------|------|
| 安装依赖 | `pnpm install` | `pnpm install` |
| 启动开发 | `pnpm run start:dev` | `pnpm dev` |
| 构建 | `pnpm run build` | `pnpm build` |
| 初始化数据 | `pnpm run seed` | - |
| 类型检查 | - | `pnpm typecheck` |
| 代码检查 | `pnpm run lint` | `pnpm lint` |
| Swagger 文档 | http://localhost:3000/api-docs | - |

---

## 注意事项

- 前端路由模式为 `dynamic`（后端动态下发），不要手动编辑 `router/elegant/` 下的自动生成文件
- 超级管理员 `R_SUPER` 是硬编码的特殊角色，权限守卫和菜单查询中都有特殊处理
- 菜单的 `component` 字段格式: 目录用 `layout.base`，页面用 `view.{path}` (如 `view.system_user`)
- 菜单 type=3 (按钮) 不会出现在路由中，仅用于权限标识
- 后端 `DB_SYNC=true` 时 TypeORM 自动同步表结构，生产环境必须关闭
- 密码字段在 `user.entity.ts` 中设置了 `select: false`，所有查询默认不返回密码。需要密码验证时使用 QueryBuilder 的 `addSelect('user.password')`
- Refresh Token 使用独立的 secret（`JWT_REFRESH_SECRET`）和更长的过期时间（`JWT_REFRESH_EXPIRES_IN`，默认 30d），与 Access Token 分离
- 删除角色前会检查是否有用户关联，有关联则阻止删除
- `.env` 中新增 `JWT_REFRESH_SECRET` 和 `JWT_REFRESH_EXPIRES_IN` 配置项，用于独立的 Refresh Token 签发
