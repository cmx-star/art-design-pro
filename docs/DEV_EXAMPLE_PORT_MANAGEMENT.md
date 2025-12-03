# 开发实例：设备管理-网口管理功能

本文档详细说明如何从零开始创建一个完整的"设备管理-网口管理"功能模块，包括路由配置、页面组件、API 接口、权限控制等。

## 📋 功能需求

1. **获取网口列表** - 支持分页、搜索、筛选
2. **WAN/LAN 切换功能** - 单个和批量切换网口类型
3. **权限控制** - 仅管理员（R_SUPER、R_ADMIN）可使用
4. **自动刷新** - 页面数据每 10 秒自动刷新
5. **左侧导航** - 在菜单中显示"设备管理-网口管理"

## 📁 需要创建/修改的文件清单

> **提示**: 以下文件路径均相对于项目根目录 `src/` 或 `docs/`

### 1. 路由配置

#### 1.1 创建路由模块文件

**文件路径**: `src/router/modules/device.ts`

**功能**: 定义设备管理模块的路由配置，包含网口管理子路由

**关键配置**:

- `path: '/device'` - 路由路径
- `name: 'Device'` - 路由名称
- `meta.roles: ['R_SUPER', 'R_ADMIN']` - 权限控制（仅管理员）
- `children[0].path: 'port'` - 网口管理子路由

#### 1.2 注册路由模块

**文件路径**: `src/router/modules/index.ts`

**修改内容**: 在 `routeModules` 数组中添加 `deviceRoutes`

```typescript
import { deviceRoutes } from './device'
export const routeModules: AppRouteRecord[] = [
  dashboardRoutes,
  systemRoutes,
  deviceRoutes, // 新增
  resultRoutes,
  exceptionRoutes
]
```

### 2. API 接口

#### 2.1 创建 API 文件

**文件路径**: `src/api/device.ts`

**功能**: 定义网口管理相关的 API 接口函数

**包含接口**:

- `fetchGetPortList()` - 获取网口列表（支持 Mock 数据）
- `fetchSwitchPortType()` - 切换网口类型（WAN/LAN，支持 Mock 数据）

**类型定义**:

- `PortListParams` - 查询参数类型
- `PortInfo` - 网口信息类型
- `PortListResponse` - 列表响应类型
- `SwitchPortTypeParams` - 切换类型参数

**Mock 支持**:

- 开发环境默认使用 Mock 数据
- 可通过环境变量 `VITE_USE_MOCK` 控制是否使用 Mock

#### 2.2 创建 Mock 数据文件

**文件路径**: `src/mock/device/port.ts`

**功能**: 提供网口管理的 Mock 数据

**包含内容**:

- `PORT_LIST_MOCK_DATA` - 网口列表 Mock 数据（12条示例数据）
- `getMockPortList()` - 模拟分页查询（支持筛选）
- `mockSwitchPortType()` - 模拟切换类型操作

**Mock 数据特性**:

- 支持分页查询
- 支持类型筛选（WAN/LAN）
- 支持名称模糊搜索
- 支持状态筛选（up/down）
- 模拟网络延迟（300ms）

#### 2.3 添加 API 类型定义

**文件路径**: `src/types/api/api.d.ts`

**修改内容**: 在 `Api` 命名空间下添加 `Device` 命名空间，定义所有设备管理相关的类型

### 3. 页面组件

#### 3.1 创建页面组件

**文件路径**: `src/views/device/port/index.vue`

**功能**: 网口管理主页面

**核心功能**:

- 搜索栏（类型、名称、状态筛选）
- 数据表格（使用 `useTable` Hook）
- WAN/LAN 切换按钮（单个和批量）
- 自动刷新（每 10 秒）
- 权限控制（使用 `v-auth` 指令）

**技术要点**:

- 使用 `useTable` Hook 管理表格数据
- 使用 `setInterval` 实现自动刷新
- 使用 `v-auth` 指令控制按钮权限
- 使用 `ElTag` 显示状态和类型

### 4. 国际化配置

#### 4.1 中文语言包

**文件路径**: `src/locales/langs/zh.json`

**添加内容**:

```json
"device": {
  "title": "设备管理",
  "port": "网口管理"
}
```

#### 4.2 英文语言包

**文件路径**: `src/locales/langs/en.json`

**添加内容**:

```json
"device": {
  "title": "Device Management",
  "port": "Port Management"
}
```

## 🔧 详细实现步骤

### 步骤 1: 创建路由模块

1. 创建 `src/router/modules/device.ts` 文件
2. 定义 `deviceRoutes` 路由配置
3. 配置权限：`roles: ['R_SUPER', 'R_ADMIN']`
4. 在 `src/router/modules/index.ts` 中导入并注册

### 步骤 2: 创建 API 接口和 Mock 数据

1. 创建 `src/api/device.ts` 文件
2. 定义 `fetchGetPortList` 函数（GET 请求，支持 Mock）
3. 定义 `fetchSwitchPortType` 函数（POST 请求，支持 Mock）
4. 创建 `src/mock/device/port.ts` 文件
5. 添加 Mock 数据（12条示例网口数据）
6. 实现 Mock 查询和切换功能
7. 在 `src/types/api/api.d.ts` 中添加类型定义

### 步骤 3: 创建页面组件

1. 创建 `src/views/device/port/index.vue` 文件
2. 使用 `ArtSearchBar` 组件创建搜索栏
3. 使用 `useTable` Hook 管理表格数据
4. 实现 WAN/LAN 切换功能
5. 实现自动刷新功能（`setInterval`）

### 步骤 4: 配置国际化

1. 在 `src/locales/langs/zh.json` 中添加中文翻译
2. 在 `src/locales/langs/en.json` 中添加英文翻译

## 📝 代码示例

### 路由配置示例

```typescript
export const deviceRoutes: AppRouteRecord = {
  path: '/device',
  name: 'Device',
  component: '/index/index',
  meta: {
    title: 'menus.device.title',
    icon: 'ri:router-line',
    roles: ['R_SUPER', 'R_ADMIN'] // 权限控制
  },
  children: [
    {
      path: 'port',
      name: 'DevicePort',
      component: '/device/port',
      meta: {
        title: 'menus.device.port',
        keepAlive: true,
        roles: ['R_SUPER', 'R_ADMIN']
      }
    }
  ]
}
```

### API 接口示例

```typescript
// 获取网口列表
export function fetchGetPortList(params: PortListParams) {
  return request.get<PortListResponse>({
    url: '/api/device/port/list',
    params
  })
}

// 切换网口类型
export function fetchSwitchPortType(params: SwitchPortTypeParams) {
  return request.post({
    url: '/api/device/port/switch-type',
    data: params,
    showSuccessMessage: true
  })
}
```

### 自动刷新实现

```typescript
// 启动自动刷新（每10秒）
const startAutoRefresh = () => {
  refreshTimer = setInterval(() => {
    refreshData()
  }, 10000) // 10秒 = 10000毫秒
}

onMounted(() => {
  startAutoRefresh()
})

onUnmounted(() => {
  if (refreshTimer) {
    clearInterval(refreshTimer)
  }
})
```

### 权限控制实现

```vue
<!-- 使用 v-auth 指令控制按钮显示 -->
<ElButton v-auth="'switch'" @click="handleSwitchType">
  切换类型
</ElButton>
```

## 🎯 功能特性

### 1. 搜索功能

- 网口类型筛选（WAN/LAN）
- 网口名称模糊搜索
- 状态筛选（启用/禁用）

### 2. 表格功能

- 分页显示
- 列配置管理（显示/隐藏列）
- 行选择（支持批量操作）
- 状态标签显示

### 3. WAN/LAN 切换

- 单个切换：点击操作列的按钮
- 批量切换：选择多行后点击批量切换按钮
- 切换前确认提示
- 切换成功后自动刷新数据

### 4. 自动刷新

- 页面加载后自动启动
- 每 10 秒刷新一次数据
- 页面卸载时自动清理定时器

### 5. 权限控制

- 路由级别：仅管理员可访问
- 按钮级别：使用 `v-auth` 指令控制

## 📊 数据流程

```
用户访问 /device/port
    ↓
路由守卫检查权限（R_SUPER/R_ADMIN）
    ↓
加载页面组件
    ↓
useTable Hook 初始化
    ↓
调用 fetchGetPortList API
    ↓
显示网口列表
    ↓
启动自动刷新定时器（10秒）
    ↓
用户操作（搜索/切换/刷新）
    ↓
更新数据并刷新表格
```

## 🔐 权限说明

### 路由权限

- `roles: ['R_SUPER', 'R_ADMIN']` - 仅超级管理员和管理员可访问

### 操作权限

- `v-auth="'switch'"` - 切换类型操作需要权限标识 'switch'

## 🧪 测试要点

1. **权限测试**
   - 非管理员用户无法访问页面
   - 无权限用户看不到操作按钮

2. **功能测试**
   - 搜索功能是否正常
   - 切换类型是否成功
   - 批量切换是否正常
   - 自动刷新是否工作

3. **数据测试**
   - 分页是否正常
   - 数据刷新是否正确
   - 错误处理是否完善

## 📚 相关文档

- [useTable Hook 文档](https://www.artd.pro/docs/zh/guide/hooks/use-table.html)
- [路由配置文档](https://www.artd.pro/docs/zh/guide/in-depth/permission.html)
- [权限控制文档](https://www.artd.pro/docs/zh/guide/in-depth/permission.html)

## 📂 完整目录结构

创建完成后，项目目录结构如下：

```
src/
├── router/
│   └── modules/
│       ├── device.ts          ← 新增：设备管理路由模块
│       └── index.ts           ← 修改：注册 deviceRoutes
├── api/
│   └── device.ts              ← 新增：设备管理 API 接口（支持 Mock）
├── mock/
│   └── device/
│       └── port.ts            ← 新增：网口管理 Mock 数据
├── types/
│   └── api/
│       └── api.d.ts           ← 修改：添加 Device 命名空间类型
├── views/
│   └── device/                ← 新增：设备管理视图目录
│       └── port/
│           └── index.vue      ← 新增：网口管理页面
└── locales/
    └── langs/
        ├── zh.json            ← 修改：添加中文翻译
        └── en.json            ← 修改：添加英文翻译

docs/
└── DEV_EXAMPLE_PORT_MANAGEMENT.md  ← 新增：开发文档
```

## ✅ 完成检查清单

- [x] 创建路由模块 `src/router/modules/device.ts`
- [x] 注册路由到 `src/router/modules/index.ts`
- [x] 创建 API 接口 `src/api/device.ts`
- [x] 创建 Mock 数据 `src/mock/device/port.ts`
- [x] 添加类型定义到 `src/types/api/api.d.ts`
- [x] 创建页面组件 `src/views/device/port/index.vue`
- [x] 添加国际化文本（中文和英文）
- [x] 实现搜索功能
- [x] 实现 WAN/LAN 切换功能
- [x] 实现自动刷新功能
- [x] 配置权限控制
- [x] 集成 Mock 数据支持

## 🎉 完成后的效果

完成以上步骤后，你将看到：

1. **左侧菜单**：出现"设备管理"菜单项，展开后显示"网口管理"
   - 菜单图标：路由器图标（ri:router-line）
   - 菜单位置：在"系统管理"之后
   - 权限控制：仅管理员可见

2. **页面内容**：
   - 搜索栏（类型、名称、状态筛选）
   - 数据表格（显示网口列表，包含：名称、类型、状态、MAC、IP、速率、描述等）
   - 操作按钮（切换类型、批量切换）
   - 表格头部（刷新按钮、列配置）

3. **自动刷新**：页面数据每 10 秒自动更新（控制台可看到刷新日志）

4. **权限控制**：
   - 路由级别：非管理员用户无法访问该页面（会跳转到首页）
   - 按钮级别：无权限用户看不到操作按钮

## 🔍 测试步骤

1. **启动项目**

   ```bash
   pnpm dev
   ```

2. **登录管理员账号**
   - 使用具有 `R_SUPER` 或 `R_ADMIN` 角色的账号登录

3. **访问页面**
   - 在左侧菜单中找到"设备管理"
   - 点击展开，选择"网口管理"
   - 或直接访问：`http://localhost:端口/#/device/port`

4. **测试功能**
   - 测试搜索功能（类型、名称、状态）
   - 测试切换类型功能（单个和批量）
   - 观察自动刷新（等待 10 秒）
   - 测试权限控制（使用非管理员账号登录）

## 💡 扩展建议

1. **添加更多筛选条件**：IP 地址范围、MAC 地址等
2. **添加导出功能**：导出网口列表为 Excel
3. **添加详情页面**：点击网口名称查看详细信息
4. **添加统计图表**：显示 WAN/LAN 数量统计
5. **添加操作日志**：记录切换操作历史
