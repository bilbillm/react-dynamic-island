# Dynamic Island Component Library - Project Setup

## 项目初始化完成 ✅

本项目已完成基础配置，包含以下技术栈和工具：

### 技术栈

- **React 18** - 核心框架
- **TypeScript** - 类型系统（严格模式已启用）
- **Vite** - 构建工具和开发服务器
- **Framer Motion** - 动画引擎
- **Tailwind CSS v4** - 样式框架

### 测试工具

- **Vitest** - 单元测试运行器
- **React Testing Library** - React 组件测试
- **@testing-library/jest-dom** - DOM 匹配器
- **@testing-library/user-event** - 用户交互模拟
- **jsdom** - DOM 环境模拟
- **fast-check** - 属性测试库

### 配置详情

#### TypeScript 配置
- ✅ 严格模式已启用 (`strict: true`)
- ✅ 路径别名配置 (`@/*` 映射到 `./src/*`)
- ✅ 测试类型支持 (`vitest/globals`, `@testing-library/jest-dom`)

#### Vitest 配置
- ✅ 全局测试 API (`globals: true`)
- ✅ jsdom 环境
- ✅ 测试设置文件 (`src/test/setup.ts`)
- ✅ CSS 支持

#### Tailwind CSS 配置
- ✅ PostCSS 配置
- ✅ 内容路径配置
- ✅ 基础样式导入

### 可用脚本

```bash
# 开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview

# 运行测试（单次）
npm test

# 监听模式运行测试
npm run test:watch

# 测试 UI
npm run test:ui

# 测试覆盖率
npm run test:coverage

# 代码检查
npm run lint
```

### 项目结构

```
react-dynamic-island/
├── src/
│   ├── lib/              # 组件库源码
│   │   ├── index.ts      # 公共 API 导出
│   │   └── types.ts      # TypeScript 类型定义
│   ├── test/             # 测试配置和工具
│   │   ├── setup.ts      # 测试环境设置
│   │   └── setup.test.ts # 设置验证测试
│   ├── App.tsx           # 示例应用
│   ├── main.tsx          # 应用入口
│   └── index.css         # 全局样式
├── public/               # 静态资源
├── dist/                 # 构建输出
├── vite.config.ts        # Vite 配置
├── tsconfig.json         # TypeScript 配置
├── tailwind.config.js    # Tailwind 配置
├── postcss.config.js     # PostCSS 配置
└── package.json          # 项目依赖
```

### 验证状态

- ✅ Vite 项目创建成功
- ✅ React + TypeScript 模板应用
- ✅ Framer Motion 已安装
- ✅ Tailwind CSS 已配置
- ✅ Vitest 测试环境已配置
- ✅ React Testing Library 已配置
- ✅ fast-check 已安装
- ✅ TypeScript 严格模式已启用
- ✅ 路径别名已配置
- ✅ 测试通过验证
- ✅ 构建成功验证

### 下一步

项目已准备好进行组件开发。下一个任务是：

**Task 2: 核心类型定义和接口**
- 定义 IslandState 类型
- 定义 ModuleProps 接口
- 定义 IslandContextType 接口
- 定义 UseIslandReturn 接口
- 定义 ModuleConfig 接口
- 定义 AnimationConfig 类型

### 依赖版本

```json
{
  "dependencies": {
    "framer-motion": "^12.35.0",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "tailwindcss": "^4.2.1"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.9.1",
    "@testing-library/react": "^16.3.2",
    "@testing-library/user-event": "^14.6.1",
    "@types/node": "^24.10.1",
    "fast-check": "^4.5.3",
    "jsdom": "^28.1.0",
    "typescript": "~5.9.3",
    "vite": "^7.3.1",
    "vitest": "^4.0.18"
  }
}
```

## 注意事项

1. 本项目使用 Tailwind CSS v4，需要使用 `@tailwindcss/postcss` 插件
2. TypeScript 严格模式已启用，所有代码必须符合严格类型检查
3. 测试环境使用 jsdom 模拟浏览器环境
4. 路径别名 `@/*` 可用于导入 src 目录下的模块

## 相关文档

- [Vite 文档](https://vitejs.dev/)
- [React 文档](https://react.dev/)
- [Framer Motion 文档](https://www.framer.com/motion/)
- [Tailwind CSS 文档](https://tailwindcss.com/)
- [Vitest 文档](https://vitest.dev/)
- [React Testing Library 文档](https://testing-library.com/react)
- [fast-check 文档](https://fast-check.dev/)
