// TypeScript type definitions for Dynamic Island Component Library

import React from 'react';

/**
 * IslandState - 灵动岛的物理状态
 * 
 * - default: 150px × 36px, border-radius: 24px
 * - compact: 200px × 40px, border-radius: 24px
 * - expanded: 360px × 160px, border-radius: 40px
 * 
 * **Validates: Requirements 9.1**
 */
export type IslandState = 'default' | 'compact' | 'expanded';

/**
 * ModuleProps - 所有模块组件必须接受的标准 props
 * 
 * **Validates: Requirements 9.2**
 */
export interface ModuleProps {
  /** 当前灵动岛状态，模块根据此渲染不同内容 */
  state: IslandState;
  /** 关闭回调，模块可主动触发隐藏 */
  onDismiss: () => void;
  /** 可选的状态变更请求，如从 compact 切换到 expanded */
  onStateChange?: (newState: IslandState) => void;
}

/**
 * IslandContextType - Context 的类型定义
 * 
 * **Validates: Requirements 9.3**
 */
export interface IslandContextType {
  /** 当前激活的模块组件类型 */
  activeModule: React.ComponentType<ModuleProps> | null;
  /** 传递给模块的额外 props */
  moduleProps: Record<string, any> | null;
  /** 当前物理状态 */
  currentState: IslandState;
  /** 更新模块和状态的方法 */
  updateModule: (
    module: React.ComponentType<ModuleProps> | null,
    props?: Record<string, any>,
    targetState?: IslandState
  ) => void;
  /** 直接设置状态的方法 */
  setState: (state: IslandState) => void;
}

/**
 * UseIslandReturn - useIsland Hook 的返回类型
 * 
 * **Validates: Requirements 9.4**
 */
export interface UseIslandReturn {
  /** 激活指定模块 */
  show: (module: React.ComponentType<ModuleProps>, config?: ModuleConfig) => void;
  /** 隐藏当前模块 */
  hide: () => void;
  /** 获取当前状态 */
  state: IslandState;
  /** 是否有激活的模块 */
  isVisible: boolean;
}

/**
 * ModuleConfig - 模块配置选项
 * 
 * **Validates: Requirements 9.5**
 */
export interface ModuleConfig {
  /** 模块激活时的初始状态（默认 'compact'） */
  initialState?: IslandState;
  /** 传递给模块的自定义 props */
  props?: Record<string, any>;
  /** 是否点击外部区域关闭（默认 false） */
  dismissOnClickOutside?: boolean;
}

/**
 * AnimationConfig - 动画配置类型
 * 
 * 定义了 Framer Motion 的动画参数
 */
export type AnimationConfig = {
  /** 布局动画配置 */
  layout: {
    type: 'spring';
    stiffness: number;
    damping: number;
  };
  /** 透明度动画配置 */
  opacity: {
    duration: number;
  };
  /** AnimatePresence 配置 */
  presence: {
    mode: 'wait';
  };
};
