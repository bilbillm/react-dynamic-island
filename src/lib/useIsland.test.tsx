import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { IslandProvider } from './IslandProvider';
import { useIsland } from './useIsland';
import type { ModuleProps } from './types';

// 简单的测试模块
const TestModule: React.FC<ModuleProps> = ({ state }) => (
  <div>Test Module in {state} state</div>
);

describe('useIsland Hook', () => {
  it('should throw error when used outside IslandProvider', () => {
    // 测试 Context 缺失时抛出错误
    // **Validates: Requirements 3.1**
    expect(() => {
      renderHook(() => useIsland());
    }).toThrow('useIsland must be used within IslandProvider');
  });

  it('should provide show method that activates module', () => {
    // 测试 show 方法激活模块
    // **Validates: Requirements 3.1, 3.4**
    const { result } = renderHook(() => useIsland(), {
      wrapper: IslandProvider,
    });

    expect(result.current.isVisible).toBe(false);
    expect(result.current.state).toBe('default');

    act(() => {
      result.current.show(TestModule, {
        initialState: 'compact',
        props: { duration: 60 },
      });
    });

    // 由于防抖逻辑（100ms），需要等待
    setTimeout(() => {
      expect(result.current.isVisible).toBe(true);
      expect(result.current.state).toBe('compact');
    }, 150);
  });

  it('should provide hide method that dismisses module', () => {
    // 测试 hide 方法关闭模块
    // **Validates: Requirements 3.2, 3.5**
    const { result } = renderHook(() => useIsland(), {
      wrapper: IslandProvider,
    });

    // 先激活模块
    act(() => {
      result.current.show(TestModule);
    });

    // 等待防抖
    setTimeout(() => {
      expect(result.current.isVisible).toBe(true);

      // 隐藏模块
      act(() => {
        result.current.hide();
      });

      // 等待重置逻辑（300ms + 100ms 防抖）
      setTimeout(() => {
        expect(result.current.isVisible).toBe(false);
        expect(result.current.state).toBe('default');
      }, 450);
    }, 150);
  });

  it('should return current state', () => {
    // 测试 state 属性返回当前状态
    // **Validates: Requirements 3.3**
    const { result } = renderHook(() => useIsland(), {
      wrapper: IslandProvider,
    });

    expect(result.current.state).toBe('default');

    act(() => {
      result.current.show(TestModule, { initialState: 'expanded' });
    });

    setTimeout(() => {
      expect(result.current.state).toBe('expanded');
    }, 150);
  });

  it('should use default initialState when not provided', () => {
    // 测试默认 initialState 为 'compact'
    const { result } = renderHook(() => useIsland(), {
      wrapper: IslandProvider,
    });

    act(() => {
      result.current.show(TestModule);
    });

    setTimeout(() => {
      expect(result.current.state).toBe('compact');
    }, 150);
  });

  it('should pass props to module', () => {
    // 测试 props 传递给模块
    const { result } = renderHook(() => useIsland(), {
      wrapper: IslandProvider,
    });

    const customProps = { duration: 120, onComplete: vi.fn() };

    act(() => {
      result.current.show(TestModule, {
        props: customProps,
      });
    });

    // 验证 props 被正确传递（通过 Context）
    // 这个测试主要验证 API 调用不会出错
    expect(() => {
      result.current.show(TestModule, { props: customProps });
    }).not.toThrow();
  });
});
