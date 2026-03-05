# visionOS Spatial Design Upgrade Tasks

## 视觉风格升级：从 iPhone 纯黑风格 → visionOS 玻璃拟态

---

## 1. 物理容器层 (DynamicIsland.tsx)

### 1.1 背景与模糊效果
- [ ] 移除 `backgroundColor: '#000'`
- [ ] 添加 Tailwind 类：`bg-[#1c1c1e]/60 backdrop-blur-3xl`
- [ ] 测试不同透明度（60% / 70% / 80%）选择最佳对比度

### 1.2 边缘高光
- [ ] 添加玻璃边缘反光：`border border-white/10`
- [ ] 或使用 ring 方案：`ring-1 ring-white/10`

### 1.3 空间悬浮感
- [ ] 添加深邃阴影：`shadow-[0_8px_32px_rgba(0,0,0,0.4)]`
- [ ] 测试阴影在不同背景下的视觉效果

### 1.4 默认文字颜色
- [ ] 移除 `color: '#fff'` 内联样式
- [ ] 通过 Tailwind 类控制文字颜色层级

---

## 2. AlarmModule.tsx 视觉适配

### 2.1 文本层级优化
- [ ] 主标题（倒计时数字）：保持 `text-white`
- [ ] Emoji 图标：保持原样
- [ ] compact 状态文字：改为 `text-white/90`

### 2.2 按钮玻璃拟态化
- [ ] "停止" 按钮：
  - 移除 `bg-red-500 hover:bg-red-600`
  - 改为 `bg-white/10 hover:bg-white/20 backdrop-blur-md text-white/90`
  - 或保留红色但降低饱和度：`bg-red-500/20 hover:bg-red-500/30 backdrop-blur-md`
  
- [ ] "稍后提醒" 按钮：
  - 移除 `bg-blue-500 hover:bg-blue-600`
  - 改为 `bg-white/10 hover:bg-white/20 backdrop-blur-md text-white/90`
  - 或保留蓝色但降低饱和度：`bg-blue-500/20 hover:bg-blue-500/30 backdrop-blur-md`

### 2.3 交互状态优化
- [ ] 添加 `transition-all duration-200` 到按钮
- [ ] 测试 hover 和 active 状态的视觉反馈

---

## 3. ToastModule.tsx 视觉适配

### 3.1 文本层级优化
- [ ] 消息文本：改为 `text-white/90`
- [ ] 图标颜色：保持彩色（success/error/warning/info）但可降低饱和度

### 3.2 图标颜色微调（可选）
- [ ] Success: `text-green-400` → `text-green-400/80`
- [ ] Error: `text-red-400` → `text-red-400/80`
- [ ] Warning: `text-yellow-400` → `text-yellow-400/80`
- [ ] Info: `text-blue-400` → `text-blue-400/80`

---

## 4. AudioModule.tsx 视觉适配

### 4.1 文本层级优化
- [ ] 歌曲标题（title）：保持 `text-white`
- [ ] 艺术家名称（artist）：改为 `text-white/60`
- [ ] 波形动画：保持 `bg-white`

### 4.2 按钮玻璃拟态化
- [ ] 播放/暂停按钮（主按钮）：
  - 移除 `bg-blue-500 hover:bg-blue-600`
  - 改为 `bg-white/15 hover:bg-white/25 backdrop-blur-md`
  
- [ ] 上一曲/下一曲按钮：
  - 移除 `bg-gray-700 hover:bg-gray-600`
  - 改为 `bg-white/10 hover:bg-white/20 backdrop-blur-md`

### 4.3 进度条优化
- [ ] 背景轨道：`bg-gray-600` → `bg-white/10`
- [ ] 进度填充：保持蓝色但降低饱和度
- [ ] 更新 inline style 的渐变色

### 4.4 专辑封面优化
- [ ] 添加微弱边框：`ring-1 ring-white/10`
- [ ] 或添加轻微阴影：`shadow-lg`

---

## 5. 测试与验证

### 5.1 视觉测试
- [ ] 在浅色背景下测试玻璃效果
- [ ] 在深色背景下测试玻璃效果
- [ ] 在图片背景下测试模糊效果
- [ ] 测试不同视口尺寸下的显示效果

### 5.2 交互测试
- [ ] 测试所有按钮的 hover 状态
- [ ] 测试状态切换动画（compact ↔ expanded）
- [ ] 测试键盘导航和焦点样式
- [ ] 测试触摸设备上的交互

### 5.3 可访问性测试
- [ ] 确保文字对比度符合 WCAG 标准
- [ ] 测试屏幕阅读器
- [ ] 测试键盘操作

### 5.4 性能测试
- [ ] 测试 backdrop-blur 性能影响
- [ ] 测试动画流畅度
- [ ] 检查是否有不必要的重渲染

---

## 6. 文档更新（可选）

- [ ] 更新 README.md 中的视觉风格描述
- [ ] 添加 visionOS 风格的截图
- [ ] 更新设计规范文档
- [ ] 添加自定义主题的示例代码

---

## 执行顺序建议

1. **Phase 1**: DynamicIsland 容器（任务 1）
2. **Phase 2**: AlarmModule（任务 2）
3. **Phase 3**: ToastModule（任务 3）
4. **Phase 4**: AudioModule（任务 4）
5. **Phase 5**: 全面测试（任务 5）

---

## 注意事项

- ✅ 保持 Framer Motion 的 layout 和物理动画参数不变
- ✅ 保持所有功能逻辑不变
- ✅ 仅修改视觉样式相关的 className 和 style
- ✅ 确保所有测试继续通过
- ⚠️ backdrop-blur 在某些浏览器可能有性能影响
- ⚠️ 半透明背景需要考虑下层内容的对比度
