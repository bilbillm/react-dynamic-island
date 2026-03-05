import React, { createContext, useState, useCallback, useRef, useEffect } from 'react';
import type { IslandContextType, IslandState, ModuleProps } from './types';

/**
 * IslandContext - 灵动岛的全局状态 Context
 * 
 * 提供灵动岛的状态管理，包括当前激活的模块、状态和控制方法
 * 
 * **Validates: Requirements 2.1**
 */
export const IslandContext = createContext<IslandContextType | undefined>(undefined);

/**
 * IslandProvider Props
 */
export interface IslandProviderProps {
  children: React.ReactNode;
  defaultState?: IslandState;
}

/**
 * IslandProvider - 灵动岛的全局状态管理组件
 * 
 * 职责：
 * - 维护当前激活的模块引用
 * - 管理灵动岛的物理状态 (default/compact/expanded)
 * - 提供状态更新方法给消费组件
 * - 处理模块切换和状态转换逻辑
 * - 实现防抖逻辑避免快速切换冲突
 * - 实现模块关闭时的重置逻辑
 * 
 * **Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5, 12.4**
 */
export const IslandProvider: React.FC<IslandProviderProps> = ({ 
  children, 
  defaultState = 'default' 
}) => {
  // 状态管理
  const [activeModule, setActiveModule] = useState<React.ComponentType<ModuleProps> | null>(null);
  const [moduleProps, setModuleProps] = useState<Record<string, any> | null>(null);
  const [currentState, setCurrentState] = useState<IslandState>(defaultState);

  // 防抖相关的 refs
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * setState - 直接设置灵动岛状态
   * 
   * **Validates: Requirements 2.3**
   */
  const setState = useCallback((state: IslandState) => {
    setCurrentState(state);
  }, []);

  /**
   * updateModule - 更新模块和状态
   * 
   * 实现防抖逻辑（100ms 阈值）避免快速切换冲突
   * 
   * **Validates: Requirements 2.2, 2.4, 12.4**
   */
  const updateModule = useCallback((
    module: React.ComponentType<ModuleProps> | null,
    props?: Record<string, any>,
    targetState?: IslandState
  ) => {
    // 清除之前的防抖定时器
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // 清除之前的重置定时器
    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
    }

    // 防抖逻辑：100ms 内的多次调用只执行最后一次
    debounceTimerRef.current = setTimeout(() => {
      if (module === null) {
        // 关闭模块：实现 300ms 重置逻辑
        // **Validates: Requirements 2.5**
        resetTimerRef.current = setTimeout(() => {
          setActiveModule(null);
          setModuleProps(null);
          setCurrentState('default');
        }, 300);
      } else {
        // 激活模块 - 使用函数式更新确保状态同步
        // 先设置 props 和 state，最后设置 module 以确保渲染时 props 已就绪
        setModuleProps(props !== undefined ? props : {});
        setCurrentState(targetState || 'compact');
        setActiveModule(() => module);
      }
    }, 100);
  }, []);

  // 清理定时器
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  const contextValue: IslandContextType = {
    activeModule,
    moduleProps,
    currentState,
    updateModule,
    setState,
  };

  return (
    <IslandContext.Provider value={contextValue}>
      {children}
    </IslandContext.Provider>
  );
};
