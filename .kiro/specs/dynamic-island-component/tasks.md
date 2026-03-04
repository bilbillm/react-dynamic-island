# Implementation Plan: Dynamic Island Component Library

## Overview

本实现计划将「网页端灵动岛 (Dynamic Island)」组件库分解为增量式的开发任务。实现基于 React 18 + TypeScript + Framer Motion + Tailwind CSS 技术栈，采用模块化架构，确保每个步骤都能独立验证并逐步集成。

## Tasks

- [x] 1. 项目初始化和基础配置
  - 使用 Vite 创建 React + TypeScript 项目
  - 配置 Tailwind CSS
  - 安装 Framer Motion 依赖
  - 配置 Vitest 和 React Testing Library
  - 安装 fast-check 用于属性测试
  - 设置 TypeScript 严格模式和路径别名
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [x] 2. 核心类型定义和接口
  - [x] 2.1 创建 TypeScript 类型定义文件
    - 定义 IslandState 字面量类型
    - 定义 ModuleProps 接口
    - 定义 IslandContextType 接口
    - 定义 UseIslandReturn 接口
    - 定义 ModuleConfig 接口
    - 定义 AnimationConfig 类型
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

  - [ ]* 2.2 编写类型定义的单元测试
    - 测试类型导出是否正确
    - 测试类型约束是否生效
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [x] 3. IslandProvider 和 Context 实现
  - [x] 3.1 实现 IslandContext 和 IslandProvider 组件
    - 创建 IslandContext 使用 createContext
    - 实现 IslandProvider 组件，管理 activeModule 和 currentState 状态
    - 实现 updateModule 方法，支持模块激活和状态转换
    - 实现 setState 方法，支持直接状态设置
    - 实现防抖逻辑（100ms 阈值）避免快速切换冲突
    - 实现模块关闭时的 300ms 重置逻辑
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 12.4_

  - [ ]* 3.2 编写 IslandProvider 的属性测试
    - **Property 5: 模块引用维护**
    - **Validates: Requirements 2.2**

  - [ ]* 3.3 编写 IslandProvider 的属性测试
    - **Property 6: 状态值维护**
    - **Validates: Requirements 2.3**

  - [ ]* 3.4 编写 IslandProvider 的属性测试
    - **Property 7: 模块激活触发状态转换**
    - **Validates: Requirements 2.4**

  - [ ]* 3.5 编写 IslandProvider 的属性测试
    - **Property 8: 关闭重置时间**
    - **Validates: Requirements 2.5**

  - [ ]* 3.6 编写 IslandProvider 的属性测试
    - **Property 37: 状态变更防抖**
    - **Validates: Requirements 12.4**

- [x] 4. useIsland Hook 实现
  - [x] 4.1 实现 useIsland Hook
    - 使用 useContext 获取 IslandContext
    - 实现 show 方法，接受模块组件和配置
    - 实现 hide 方法，触发隐藏动画和状态重置
    - 返回 state 和 isVisible 属性
    - 添加 Context 缺失检查，抛出描述性错误
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

  - [ ]* 4.2 编写 useIsland Hook 的单元测试
    - 测试 show 方法激活模块
    - 测试 hide 方法关闭模块
    - 测试 Context 缺失时抛出错误
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

  - [ ]* 4.3 编写 useIsland Hook 的属性测试
    - **Property 9: Hook 激活模块**
    - **Validates: Requirements 3.4**

  - [ ]* 4.4 编写 useIsland Hook 的属性测试
    - **Property 10: Hook 隐藏模块**
    - **Validates: Requirements 3.5**

- [x] 5. DynamicIsland 容器组件实现
  - [x] 5.1 实现 DynamicIsland 容器组件
    - 使用 motion.div 作为根元素
    - 应用 layout 属性启用自动布局动画
    - 配置弹簧物理参数（stiffness: 300, damping: 20）
    - 根据 currentState 动态计算宽度、高度和圆角
    - 实现居中定位（fixed + transform）
    - 使用 AnimatePresence 包裹模块内容，配置 mode="wait"
    - 实现内容 opacity 过渡（0.2s）
    - 添加 ARIA role 和 label 属性
    - 实现键盘焦点支持和 Escape 键关闭
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 4.1, 4.2, 4.4, 8.1, 8.2, 8.3, 8.4, 8.5, 11.1, 11.2, 11.3_

  - [ ]* 5.2 编写 DynamicIsland 的属性测试
    - **Property 1: 状态尺寸规格**
    - **Validates: Requirements 1.1**

  - [ ]* 5.3 编写 DynamicIsland 的属性测试
    - **Property 2: 弹簧物理配置**
    - **Validates: Requirements 1.2, 8.2**

  - [ ]* 5.4 编写 DynamicIsland 的属性测试
    - **Property 3: 居中位置保持**
    - **Validates: Requirements 1.4**

  - [ ]* 5.5 编写 DynamicIsland 的属性测试
    - **Property 4: 动画时长范围**
    - **Validates: Requirements 1.5**

  - [ ]* 5.6 编写 DynamicIsland 的属性测试
    - **Property 13: 内容动画时序**
    - **Validates: Requirements 4.4, 8.3**

  - [ ]* 5.7 编写 DynamicIsland 的单元测试
    - 测试默认状态渲染
    - 测试状态转换动画
    - 测试 Escape 键关闭功能
    - _Requirements: 1.1, 1.2, 11.3_

- [x] 6. Checkpoint - 验证核心架构
  - 确保 IslandProvider、useIsland Hook 和 DynamicIsland 容器正常工作
  - 运行所有测试确保通过
  - 如有问题请询问用户

- [ ] 7. AlarmModule 实现
  - [x] 7.1 实现 AlarmModule 组件
    - 定义 AlarmModuleProps 接口（继承 ModuleProps）
    - 实现倒计时逻辑（useEffect + setInterval）
    - 实现 compact 状态渲染（"⏱️ MM:SS" 格式）
    - 实现 expanded 状态渲染（大号数字 + 按钮）
    - 实现 "停止" 按钮，调用 onDismiss 并停止定时器
    - 实现 "稍后提醒" 按钮，增加 300 秒并调用 onStateChange('compact')
    - 实现倒计时归零时调用 onComplete
    - 清理定时器（useEffect cleanup）
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

  - [ ]* 7.2 编写 AlarmModule 的属性测试
    - **Property 14: Alarm 模块 compact 状态渲染**
    - **Validates: Requirements 5.1**

  - [ ]* 7.3 编写 AlarmModule 的属性测试
    - **Property 15: Alarm 模块 expanded 状态渲染**
    - **Validates: Requirements 5.2**

  - [ ]* 7.4 编写 AlarmModule 的属性测试
    - **Property 16: Alarm 倒计时归零回调**
    - **Validates: Requirements 5.3**

  - [ ]* 7.5 编写 AlarmModule 的属性测试
    - **Property 17: Alarm 停止按钮行为**
    - **Validates: Requirements 5.4**

  - [ ]* 7.6 编写 AlarmModule 的属性测试
    - **Property 18: Alarm 稍后提醒行为**
    - **Validates: Requirements 5.5**

  - [ ]* 7.7 编写 AlarmModule 的单元测试
    - 测试边缘情况（0 秒倒计时、极大值）
    - 测试定时器清理
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 8. ToastModule 实现
  - [x] 8.1 实现 ToastModule 组件
    - 定义 ToastModuleProps 接口（继承 ModuleProps）
    - 实现 compact 状态渲染（图标 + 文本，最多 30 字符）
    - 根据 variant 选择对应图标（success/error/warning/info）
    - 实现自动关闭定时器（默认 3000ms）
    - 定时器到期后调用 onDismiss
    - 清理定时器（useEffect cleanup）
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

  - [ ]* 8.2 编写 ToastModule 的属性测试
    - **Property 19: Toast 初始状态**
    - **Validates: Requirements 6.1**

  - [ ]* 8.3 编写 ToastModule 的属性测试
    - **Property 20: Toast 内容渲染**
    - **Validates: Requirements 6.2**

  - [ ]* 8.4 编写 ToastModule 的属性测试
    - **Property 21: Toast 自动关闭**
    - **Validates: Requirements 6.3, 6.4**

  - [ ]* 8.5 编写 ToastModule 的属性测试
    - **Property 22: Toast 变体图标**
    - **Validates: Requirements 6.5**

  - [ ]* 8.6 编写 ToastModule 的单元测试
    - 测试文本截断逻辑
    - 测试自定义图标
    - _Requirements: 6.2, 6.5_

- [x] 9. AudioModule 实现
  - [x] 9.1 实现 AudioModule 组件
    - 定义 AudioModuleProps 接口（继承 ModuleProps）
    - 实现 compact 状态渲染（左侧专辑封面 + 右侧波形动画）
    - 实现 expanded 状态渲染（专辑封面 + 歌曲信息 + 进度条 + 控制按钮）
    - 实现波形动画（使用 Framer Motion animate，根据 isPlaying 控制）
    - 实现播放/暂停按钮，调用 onPlayPause
    - 实现进度条拖拽，调用 onSeek
    - 实现上一曲/下一曲按钮（如果提供回调）
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

  - [ ]* 9.2 编写 AudioModule 的属性测试
    - **Property 23: Audio 模块 compact 状态布局**
    - **Validates: Requirements 7.1**

  - [ ]* 9.3 编写 AudioModule 的属性测试
    - **Property 24: Audio 模块 expanded 状态布局**
    - **Validates: Requirements 7.2**

  - [ ]* 9.4 编写 AudioModule 的属性测试
    - **Property 25: Audio 播放控制**
    - **Validates: Requirements 7.3**

  - [ ]* 9.5 编写 AudioModule 的属性测试
    - **Property 26: Audio 进度拖拽**
    - **Validates: Requirements 7.4**

  - [ ]* 9.6 编写 AudioModule 的属性测试
    - **Property 27: Audio 波形动画**
    - **Validates: Requirements 7.5**

  - [ ]* 9.7 编写 AudioModule 的单元测试
    - 测试进度条边界值（0 和 1）
    - 测试可选回调（onPrevious/onNext）
    - _Requirements: 7.3, 7.4_

- [x] 10. Checkpoint - 验证所有内置模块
  - 确保 AlarmModule、ToastModule 和 AudioModule 正常工作
  - 运行所有测试确保通过
  - 如有问题请询问用户

- [x] 11. 响应式布局实现
  - [x] 11.1 实现响应式尺寸适配
    - 添加视口宽度监听（ResizeObserver 或 window resize）
    - 实现小于 400px 时的比例缩放逻辑
    - 实现小于 360px 时的 expanded 状态宽度调整
    - 实现 200ms 内完成尺寸适配
    - 使用防抖优化频繁调整
    - _Requirements: 10.1, 10.3, 10.5_

  - [x] 11.2 实现最小触摸目标尺寸
    - 确保所有交互元素至少 44px × 44px
    - 在模块组件中应用最小尺寸约束
    - _Requirements: 10.4_

  - [ ]* 11.3 编写响应式布局的属性测试
    - **Property 28: 响应式尺寸缩放**
    - **Validates: Requirements 10.1**

  - [ ]* 11.4 编写响应式布局的属性测试
    - **Property 29: 视口调整响应时间**
    - **Validates: Requirements 10.3**

  - [ ]* 11.5 编写响应式布局的属性测试
    - **Property 30: 最小触摸目标尺寸**
    - **Validates: Requirements 10.4**

  - [ ]* 11.6 编写响应式布局的属性测试
    - **Property 31: 极小视口适配**
    - **Validates: Requirements 10.5**

  - [ ]* 11.7 编写响应式布局的单元测试
    - 测试极端视口尺寸（< 150px）
    - 测试快速调整大小
    - _Requirements: 10.1, 10.3_

- [x] 12. 可访问性增强
  - [x] 12.1 实现完整的可访问性支持
    - 添加 ARIA role 和 label 到 DynamicIsland
    - 实现 ARIA live region 用于状态通知
    - 实现焦点管理（模块切换时转移焦点）
    - 确保键盘可聚焦性（tabIndex）
    - 确保 Escape 键关闭功能
    - 为所有交互元素添加 ARIA 属性
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

  - [ ]* 12.2 编写可访问性的属性测试
    - **Property 32: 键盘可聚焦性**
    - **Validates: Requirements 11.2**

  - [ ]* 12.3 编写可访问性的属性测试
    - **Property 33: Escape 键关闭**
    - **Validates: Requirements 11.3**

  - [ ]* 12.4 编写可访问性的属性测试
    - **Property 34: ARIA 状态通知**
    - **Validates: Requirements 11.4**

  - [ ]* 12.5 编写可访问性的属性测试
    - **Property 35: 焦点管理**
    - **Validates: Requirements 11.5**

  - [ ]* 12.6 编写可访问性的单元测试
    - 使用 jest-axe 进行自动化可访问性检查
    - 测试键盘导航流程
    - 测试屏幕阅读器支持
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

- [x] 13. 性能优化
  - [x] 13.1 实现性能优化措施
    - 使用 React.memo 包裹 DynamicIsland 和模块组件
    - 使用 useMemo 和 useCallback 优化依赖
    - 实现条件渲染（activeModule 为 null 时不渲染模块树）
    - 添加 will-change CSS 属性提示浏览器优化
    - 检测 prefers-reduced-motion 并提供降级方案
    - _Requirements: 12.1, 12.2, 12.3_

  - [ ]* 13.2 编写性能优化的属性测试
    - **Property 36: 条件渲染优化**
    - **Validates: Requirements 12.3**

  - [ ]* 13.3 编写性能优化的单元测试
    - 测试 React.memo 防止不必要的重新渲染
    - 测试内存泄漏（定时器和事件监听器清理）
    - _Requirements: 12.1, 12.3_

- [x] 14. 错误处理和边界情况
  - [x] 14.1 实现错误处理机制
    - 添加 React Error Boundary 包裹模块内容
    - 实现无效状态值的运行时验证和回退
    - 实现无效模块组件的检查和错误提示
    - 添加开发模式下的详细错误信息
    - 实现模块卸载后的状态更新保护
    - _Requirements: 4.1, 4.5_

  - [ ]* 14.2 编写错误处理的单元测试
    - 测试无效状态值处理
    - 测试无效模块组件处理
    - 测试 Context 缺失错误
    - 测试模块内部错误捕获
    - _Requirements: 4.1, 4.5_

  - [ ]* 14.3 编写模块解耦的属性测试
    - **Property 11: 模块渲染解耦**
    - **Validates: Requirements 4.1, 4.5**

  - [ ]* 14.4 编写模块配置的属性测试
    - **Property 12: 模块状态配置**
    - **Validates: Requirements 4.3**

- [x] 15. 集成测试和端到端测试
  - [ ]* 15.1 编写集成测试
    - 测试完整的 Alarm 工作流程
    - 测试完整的 Toast 工作流程
    - 测试完整的 Audio 工作流程
    - 测试模块切换流程
    - 测试自定义模块集成
    - _Requirements: 4.5, 5.1, 5.2, 5.3, 5.4, 5.5, 6.1, 6.2, 6.3, 6.4, 6.5, 7.1, 7.2, 7.3, 7.4, 7.5_

- [x] 16. 导出和打包配置
  - [x] 16.1 配置组件库导出
    - 创建 index.ts 导出所有公共 API
    - 导出 IslandProvider、DynamicIsland、useIsland
    - 导出 AlarmModule、ToastModule、AudioModule
    - 导出所有 TypeScript 类型
    - 配置 Vite 库模式打包
    - 配置 package.json 的 exports 字段
    - 生成类型声明文件（.d.ts）
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

  - [x] 16.2 验证打包产物
    - 检查 bundle 大小（应小于 50KB gzipped）
    - 检查类型声明文件完整性
    - 测试在外部项目中导入
    - _Requirements: 12.5_

- [~] 17. 文档和示例
  - [x] 17.1 创建使用文档
    - 编写 README.md（安装、快速开始、API 文档）
    - 创建基础使用示例
    - 创建自定义模块示例
    - 创建 API 参考文档
    - 添加 TypeScript 类型说明

  - [ ] 17.2 创建 Storybook 示例（可选）
    - 配置 Storybook
    - 创建各个组件的 Story
    - 创建交互式示例
    - 配置视觉回归测试

- [x] 18. Final Checkpoint - 完整验证
  - 运行所有单元测试和属性测试
  - 运行集成测试
  - 运行可访问性测试
  - 检查测试覆盖率（目标：≥ 90%）
  - 验证打包产物大小
  - 在示例项目中测试完整功能
  - 如有问题请询问用户

## Notes

- 任务标记 `*` 的为可选测试任务，可以跳过以加快 MVP 开发
- 每个任务都引用了具体的需求编号，确保可追溯性
- 属性测试任务明确标注了对应的设计文档属性编号
- Checkpoint 任务确保增量验证，及时发现问题
- 所有代码使用 TypeScript 编写，确保类型安全
- 使用 Framer Motion 实现所有动画效果
- 使用 Tailwind CSS 进行样式管理
