import { useContext, useCallback, useMemo } from 'react';
import { IslandContext } from './IslandProvider';
import type { UseIslandReturn, ModuleProps, ModuleConfig } from './types';

/**
 * useIsland - 核心 API Hook，用于在任何组件中控制灵动岛
 * 
 * 提供简洁的命令式 API 来激活和隐藏模块
 * 
 * 使用示例：
 * ```tsx
 * const island = useIsland();
 * 
 * // 激活模块
 * island.show(AlarmModule, {
 *   initialState: 'compact',
 *   props: { duration: 60 }
 * });
 * 
 * // 隐藏模块
 * island.hide();
 * 
 * // 获取当前状态
 * console.log(island.state); // 'default' | 'compact' | 'expanded'
 * console.log(island.isVisible); // boolean
 * ```
 * 
 * @throws {Error} 如果在 IslandProvider 外部使用
 * 
 * **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5**
 */
export function useIsland(): UseIslandReturn {
  // 获取 Context
  const context = useContext(IslandContext);

  // Context 缺失检查，抛出描述性错误
  // **Validates: Requirements 3.1**
  if (!context) {
    throw new Error(
      'useIsland must be used within IslandProvider. ' +
      'Please wrap your component tree with <IslandProvider>. ' +
      'See documentation: https://github.com/your-repo/dynamic-island#usage'
    );
  }

  const { activeModule, currentState, updateModule } = context;

  /**
   * show - 激活指定模块
   * 
   * 接受模块组件和可选配置，调用 Context 的更新方法
   * 
   * **Validates: Requirements 3.1, 3.4**
   */
  const show = useCallback((
    module: React.ComponentType<ModuleProps>,
    config?: ModuleConfig
  ) => {
    const initialState = config?.initialState || 'compact';
    const props = config?.props || {};
    
    updateModule(module, props, initialState);
  }, [updateModule]);

  /**
   * hide - 隐藏当前模块
   * 
   * 触发隐藏动画，300ms 后重置状态
   * 
   * **Validates: Requirements 3.2, 3.5**
   */
  const hide = useCallback(() => {
    updateModule(null);
  }, [updateModule]);

  /**
   * isVisible - 是否有激活的模块
   * 
   * **Validates: Requirements 3.3**
   */
  const isVisible = useMemo(() => {
    return activeModule !== null;
  }, [activeModule]);

  // 返回 API
  return {
    show,
    hide,
    state: currentState,
    isVisible,
  };
}
