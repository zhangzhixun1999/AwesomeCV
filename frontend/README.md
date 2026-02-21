# 简历生成器 - 前端

基于 React + TypeScript + Vite 构建的现代化简历生成器前端应用。

## 技术栈

- **框架**: React 18 + TypeScript
- **构建工具**: Vite 5
- **路由**: React Router v6
- **状态管理**: TanStack Query (React Query)
- **表单**: React Hook Form + Zod
- **样式**: Tailwind CSS
- **HTTP 客户端**: Axios
- **PDF 生成**: @react-pdf/renderer
- **图标**: Lucide React

## 项目结构

```
src/
├── components/          # 组件目录
│   ├── ui/             # UI 组件库
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── TextArea.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   ├── Loading.tsx
│   │   └── Badge.tsx
│   ├── layout/         # 布局组件
│   │   ├── AppLayout.tsx
│   │   └── AuthLayout.tsx
│   ├── resume/         # 简历相关组件
│   └── ProtectedRoute.tsx  # 路由守卫
├── pages/              # 页面组件
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── Dashboard.tsx
│   ├── Templates.tsx
│   └── Editor.tsx
├── hooks/              # 自定义 Hooks
│   ├── useAuth.ts
│   ├── useResumes.ts
│   └── useTemplates.ts
├── services/           # API 服务
│   ├── authService.ts
│   ├── resumeService.ts
│   └── templateService.ts
├── types/              # TypeScript 类型定义
│   └── index.ts
├── utils/              # 工具函数
│   ├── api.ts         # Axios 客户端配置
│   ├── validation.ts  # Zod 验证 schemas
│   ├── format.ts      # 格式化函数
│   └── cn.ts          # className 工具
├── styles/             # 样式文件
│   └── index.css      # 全局样式 + Tailwind
├── App.tsx             # 应用根组件
└── main.tsx            # 应用入口
```

## 快速开始

### 1. 安装依赖

```bash
cd frontend
npm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env` 并配置：

```bash
cp .env.example .env
```

`.env` 文件内容：
```env
VITE_API_BASE_URL=http://localhost:8000
```

### 3. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:5173

### 4. 构建生产版本

```bash
npm run build
```

## 功能特性

### 已实现

- ✅ 完整的 UI 组件库
- ✅ 用户认证（登录/注册）
- ✅ 仪表盘（简历列表）
- ✅ 模板选择页面
- ✅ 简历编辑器（带实时预览）
- ✅ 自动保存功能
- ✅ 路由守卫
- ✅ 响应式设计

### 待实现

- ⏳ PDF 生成和下载
- ⏳ 简历复制功能
- ⏳ 社交登录（Google、GitHub）
- ⏳ 拖拽排序
- ⏳ 图片上传

## 设计系统

### 颜色

```css
--primary: #2383E2          /* 主色调 - 蓝色 */
--primary-hover: #1A6CC0    /* 主色悬停 */
--background-body: #FFFFFF  /* 页面背景 */
--background-gray: #F7F7F5  /* 浅灰背景 */
--text-primary: #37352F     /* 主文本 */
--text-secondary: #787774   /* 次要文本 */
--danger: #E03E3E           /* 危险色 */
--success: #0F7B6C          /* 成功色 */
```

### 间距

- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- 2xl: 48px

### 圆角

- sm: 4px
- md: 6px
- lg: 8px

## API 集成

所有 API 请求都通过配置好的 Axios 客户端发送，自动处理：
- JWT token 注入
- Token 自动刷新
- 错误处理
- 请求重试

## 浏览器支持

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## 开发注意事项

1. **代码风格**：项目使用 ESLint 进行代码检查
2. **类型安全**：所有组件和函数都有完整的 TypeScript 类型定义
3. **表单验证**：使用 Zod schemas 进行数据验证
4. **状态管理**：服务端状态使用 TanStack Query 管理

## 常见问题

### Q: 如何添加新的 UI 组件？

在 `src/components/ui/` 目录下创建新组件，并在 `src/components/ui/index.ts` 中导出。

### Q: 如何添加新的页面？

在 `src/pages/` 目录下创建页面组件，并在 `src/App.tsx` 中添加路由。

### Q: 如何调用 API？

使用 `src/hooks/` 中的自定义 Hooks，或直接使用 `src/services/` 中的服务函数。
