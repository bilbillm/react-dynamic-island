# React Dynamic Island

一个高度定制化、支持插拔的「网页端灵动岛 (Dynamic Island)」开源组件库。基于 React 18 和 Framer Motion 构建，提供流畅的物理动画和模块化的内容展示能力。

## ✨ 特性

- 🎨 **极致的动画表现** - 使用 Framer Motion 的 layout 属性和 Spring 物理引擎，实现苹果级的阻尼动画
- 🧩 **高度模块化** - 灵动岛容器与内容完全解耦，支持自定义模块扩展
- 🎯 **易用的 API** - 通过 Context 和 Hook 提供简洁直观的控制接口
- 📱 **响应式设计** - 自动适配不同屏幕尺寸，支持移动端和桌面端
- ♿ **可访问性支持** - 完整的 ARIA 属性和键盘导航支持
- 🔒 **TypeScript** - 完整的类型定义，提供优秀的开发体验
- ⚡ **高性能** - 使用 GPU 加速和 React 优化技术

## 📦 安装

```bash
npm install react-dynamic-island
# 或
yarn add react-dynamic-island
# 或
pnpm add react-dynamic-island
```

## 🚀 快速开始

### 1. 基础使用

```tsx
import { IslandProvider, DynamicIsland, useIsland } from 'react-dynamic-island';

function App() {
  return (
    <IslandProvider>
      <DynamicIsland />
      <YourContent />
    </IslandProvider>
  );
}

function YourContent() {
  const island = useIsland();

  return (
    <button onClick={() => island.show(YourModule)}>
      显示灵动岛
    </button>
  );
}
```

### 2. 使用内置模块

```tsx
import { useIsland, AlarmModule, ToastModule, AudioModule } from 'react-dynamic-island';

function Demo() {
  const island = useIsland();

  // 显示闹钟模块
  const showAlarm = () => {
    island.show(AlarmModule, {
      initialState: 'compact',
      props: {
        duration: 60, // 60秒倒计时
        onComplete: () => console.log('时间到！'),
        onSnooze: (minutes) => console.log(`稍后提醒 ${minutes} 分钟`),
      },
    });
  };

  // 显示通知模块
  const showToast = () => {
    island.show(ToastModule, {
      initialState: 'compact',
      props: {
        message: '操作成功！',
        variant: 'success', // success | error | warning | info
      },
    });
  };

  // 显示音频模块
  const showAudio = () => {
    island.show(AudioModule, {
      initialState: 'compact',
      props: {
        title: '歌曲名称',
        artist: '艺术家',
        albumCover: '/path/to/cover.jpg',
        isPlaying: true,
        progress: 0.5,
        onPlayPause: () => console.log('播放/暂停'),
        onSeek: (position) => console.log('跳转到', position),
      },
    });
  };

  return (
    <div>
      <button onClick={showAlarm}>显示闹钟</button>
      <button onClick={showToast}>显示通知</button>
      <button onClick={showAudio}>显示音频</button>
    </div>
  );
}
```

### 3. 创建自定义模块

```tsx
import type { ModuleProps } from 'react-dynamic-island';

interface CustomModuleProps extends ModuleProps {
  title: string;
  content: string;
}

const CustomModule: React.FC<CustomModuleProps> = ({
  state,
  title,
  content,
  onDismiss,
  onStateChange,
}) => {
  if (state === 'compact') {
    return (
      <div onClick={() => onStateChange?.('expanded')}>
        <h3>{title}</h3>
      </div>
    );
  }

  if (state === 'expanded') {
    return (
      <div>
        <h2>{title}</h2>
        <p>{content}</p>
        <button onClick={onDismiss}>关闭</button>
      </div>
    );
  }

  return null;
};

// 使用自定义模块
function App() {
  const island = useIsland();

  const showCustom = () => {
    island.show(CustomModule, {
      initialState: 'compact',
      props: {
        title: '自定义标题',
        content: '自定义内容',
      },
    });
  };

  return <button onClick={showCustom}>显示自定义模块</button>;
}
```

## 📖 API 文档

### IslandProvider

全局状态管理组件，必须包裹在应用根部。

```tsx
<IslandProvider defaultState="default">
  {children}
</IslandProvider>
```

**Props:**
- `defaultState?: IslandState` - 初始状态，默认为 `'default'`
- `children: React.ReactNode` - 子组件

### DynamicIsland

灵动岛容器组件，负责渲染和动画。

```tsx
<DynamicIsland className="custom-class" style={{ top: '40px' }} />
```

**Props:**
- `className?: string` - 自定义类名
- `style?: React.CSSProperties` - 自定义样式

### useIsland Hook

核心 API Hook，用于控制灵动岛。

```tsx
const island = useIsland();
```

**返回值:**
- `show(module, config?)` - 激活指定模块
- `hide()` - 隐藏当前模块
- `state: IslandState` - 当前状态 (`'default'` | `'compact'` | `'expanded'`)
- `isVisible: boolean` - 是否有激活的模块

**ModuleConfig:**
```typescript
interface ModuleConfig {
  initialState?: IslandState; // 初始状态，默认 'compact'
  props?: Record<string, any>; // 传递给模块的自定义 props
  dismissOnClickOutside?: boolean; // 点击外部是否关闭，默认 false
}
```

### ModuleProps

所有模块组件必须接受的标准 props。

```typescript
interface ModuleProps {
  state: IslandState; // 当前灵动岛状态
  onDismiss: () => void; // 关闭回调
  onStateChange?: (newState: IslandState) => void; // 状态变更回调
}
```

## 🎨 内置模块

### AlarmModule - 闹钟模块

```typescript
interface AlarmModuleProps extends ModuleProps {
  duration: number; // 倒计时秒数
  onComplete?: () => void; // 倒计时归零回调
  onSnooze?: (additionalMinutes: number) => void; // 稍后提醒回调
}
```

**特性:**
- compact 状态：显示 "⏱️ MM:SS" 格式倒计时
- expanded 状态：大号数字 + "停止" 和 "稍后提醒" 按钮
- 自动倒计时，归零时触发回调

### ToastModule - 通知模块

```typescript
interface ToastModuleProps extends ModuleProps {
  message: string; // 消息文本（最多 30 字符）
  variant?: 'success' | 'error' | 'warning' | 'info'; // 变体类型
  duration?: number; // 自动关闭时长（毫秒），默认 3000ms
  icon?: React.ReactNode; // 自定义图标
}
```

**特性:**
- 4 种变体类型，自动显示对应图标
- 自动截断超长文本
- 默认 3 秒后自动关闭

### AudioModule - 音频模块

```typescript
interface AudioModuleProps extends ModuleProps {
  title: string; // 歌曲标题
  artist: string; // 艺术家名称
  albumCover: string; // 专辑封面 URL
  isPlaying: boolean; // 是否正在播放
  progress: number; // 播放进度（0-1）
  onPlayPause: () => void; // 播放/暂停回调
  onSeek: (position: number) => void; // 进度拖拽回调
  onPrevious?: () => void; // 上一曲回调
  onNext?: () => void; // 下一曲回调
}
```

**特性:**
- compact 状态：专辑封面 + 波形动画
- expanded 状态：完整播放控制界面
- 支持进度条拖拽、播放/暂停、切歌

## ⌨️ 键盘快捷键

- `Escape` - 关闭当前激活的模块
- `Enter` / `Space` - 在可交互元素上触发操作
- `Tab` - 在交互元素间导航

## 🎯 状态说明

灵动岛支持三种物理状态：

| 状态 | 尺寸 | 圆角 | 说明 |
|------|------|------|------|
| `default` | 150px × 36px | 24px | 静息态，仅渲染黑底 |
| `compact` | 200px × 40px | 24px | 紧凑态，显示简要信息 |
| `expanded` | 360px × 160px | 40px | 展开态，显示完整内容 |

## 📱 响应式设计

- 视口宽度 < 400px：按比例缩放所有尺寸
- 视口宽度 < 360px：调整 expanded 状态宽度以适应屏幕
- 所有交互元素保持最小 44px × 44px 触摸目标尺寸
- 200ms 内完成尺寸适配

## 🎬 动画配置

使用 Framer Motion 的 Spring 物理引擎：

```typescript
{
  type: 'spring',
  stiffness: 300, // 弹簧刚度
  damping: 20,    // 阻尼系数
}
```

- 所有宽、高、圆角变化带有自然的呼吸感和微小回弹
- 内容 opacity 过渡时间（0.2s）快于容器形变
- 使用 `AnimatePresence` 控制模块切换动画

## 🛠️ 技术栈

- **React 18** - 核心框架
- **TypeScript** - 类型系统
- **Framer Motion** - 动画引擎
- **Tailwind CSS** - 样式方案

## 📄 License

MIT © [Your Name]

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 🔗 相关链接

- [GitHub Repository](https://github.com/your-repo/react-dynamic-island)
- [Documentation](https://your-docs-site.com)
- [Examples](https://your-examples-site.com)
