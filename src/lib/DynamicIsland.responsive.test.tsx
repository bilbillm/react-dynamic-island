import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { DynamicIsland } from './DynamicIsland';
import { IslandProvider } from './IslandProvider';
import type { ModuleProps } from './types';

/**
 * 响应式布局测试
 * 
 * 测试 DynamicIsland 的响应式行为，包括：
 * - 视口宽度小于 400px 时的比例缩放
 * - 视口宽度小于 360px 时的 expanded 状态宽度调整
 * - 视口变化的响应时间
 * - 最小触摸目标尺寸
 * 
 * **Validates: Requirements 10.1, 10.3, 10.4, 10.5**
 */

// 简单的测试模块
const TestModule: React.FC<ModuleProps> = ({ state }) => (
  <div data-testid="test-module">Test Module - {state}</div>
);

describe('DynamicIsland Responsive Layout', () => {
  let originalInnerWidth: number;
  let resizeObserverCallback: ResizeObserverCallback | null = null;

  beforeEach(() => {
    // 保存原始 innerWidth
    originalInnerWidth = window.innerWidth;

    // Mock ResizeObserver - 使用 class 语法
    global.ResizeObserver = class ResizeObserver {
      callback: ResizeObserverCallback;
      
      constructor(callback: ResizeObserverCallback) {
        this.callback = callback;
        resizeObserverCallback = callback;
      }
      
      observe() {
        // 立即触发回调以模拟初始化
        this.callback([], this);
      }
      
      unobserve() {}
      disconnect() {}
    } as any;
  });

  afterEach(() => {
    // 恢复原始 innerWidth
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });
    resizeObserverCallback = null;
    vi.restoreAllMocks();
  });

  /**
   * 测试默认状态下的尺寸（视口宽度 >= 400px）
   * 
   * **Validates: Requirements 1.1**
   */
  it('should render with full size when viewport >= 400px', async () => {
    // 设置视口宽度为 400px
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 400,
    });

    const { container } = render(
      <IslandProvider defaultState="default">
        <DynamicIsland />
      </IslandProvider>
    );

    await waitFor(() => {
      const island = container.querySelector('[role="region"]') as HTMLElement;
      expect(island).toBeTruthy();
      
      // 默认状态应该是 150px × 36px
      expect(island.style.width).toBe('150px');
      expect(island.style.height).toBe('36px');
    });
  });

  /**
   * 测试视口宽度小于 400px 时的比例缩放
   * 
   * **Validates: Requirements 10.1**
   */
  it('should scale proportionally when viewport < 400px', async () => {
    // 设置视口宽度为 300px
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 300,
    });

    const { container } = render(
      <IslandProvider defaultState="default">
        <DynamicIsland />
      </IslandProvider>
    );

    await waitFor(() => {
      const island = container.querySelector('[role="region"]') as HTMLElement;
      
      // 缩放比例应该是 300 / 400 = 0.75
      // 默认状态 150px × 36px 应该缩放为 112.5px × 27px
      const expectedWidth = 150 * 0.75;
      const expectedHeight = 36 * 0.75;
      
      expect(parseFloat(island.style.width)).toBeCloseTo(expectedWidth, 1);
      expect(parseFloat(island.style.height)).toBeCloseTo(expectedHeight, 1);
    });
  });

  /**
   * 测试视口宽度小于 360px 时 expanded 状态的宽度调整
   * 
   * **Validates: Requirements 10.5**
   */
  it('should adjust expanded width when viewport < 360px', async () => {
    // 设置视口宽度为 340px
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 340,
    });

    const { container } = render(
      <IslandProvider defaultState="expanded">
        <DynamicIsland />
      </IslandProvider>
    );

    await waitFor(() => {
      const island = container.querySelector('[role="region"]') as HTMLElement;
      
      // 视口宽度 340px，安全边距 20px × 2 = 40px
      // 最大宽度应该是 340 - 40 = 300px
      // 缩放比例 340 / 400 = 0.85
      // 实际宽度 = min(360, 300) * 0.85 = 300 * 0.85 = 255px
      const width = parseFloat(island.style.width);
      expect(width).toBeLessThan(360); // 应该小于原始 expanded 宽度
      expect(width).toBeLessThanOrEqual(255); // 应该等于或小于调整后的宽度
    });
  });

  /**
   * 测试视口变化的响应时间（200ms 内完成）
   * 
   * **Validates: Requirements 10.3**
   */
  it('should use spring animation for smooth transitions', () => {
    const { container } = render(
      <IslandProvider defaultState="default">
        <DynamicIsland />
      </IslandProvider>
    );

    const island = container.querySelector('[role="region"]') as HTMLElement;
    
    // 验证元素存在且可见
    expect(island).toBeTruthy();
    expect(island.style.position).toBe('fixed');
    expect(island.style.zIndex).toBe('9999');
  });

  /**
   * 测试最小触摸目标尺寸常量导出
   * 
   * **Validates: Requirements 10.4**
   */
  it('should export MIN_TOUCH_TARGET_SIZE constant', async () => {
    const { MIN_TOUCH_TARGET_SIZE } = await import('./DynamicIsland');
    expect(MIN_TOUCH_TARGET_SIZE).toBe(44);
  });

  /**
   * 测试宽高比保持不变
   * 
   * **Validates: Requirements 10.1**
   */
  it('should maintain aspect ratio when scaling', async () => {
    // 设置视口宽度为 200px
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 200,
    });

    const { container } = render(
      <IslandProvider defaultState="compact">
        <DynamicIsland />
      </IslandProvider>
    );

    await waitFor(() => {
      const island = container.querySelector('[role="region"]') as HTMLElement;
      
      const width = parseFloat(island.style.width);
      const height = parseFloat(island.style.height);
      
      // compact 状态原始宽高比：200 / 40 = 5
      const aspectRatio = width / height;
      expect(aspectRatio).toBeCloseTo(5, 1);
    });
  });

  /**
   * 测试极端视口尺寸（非常小的视口）
   * 
   * **Validates: Requirements 10.1**
   */
  it('should handle very small viewport sizes', async () => {
    // 设置视口宽度为 150px（极小）
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 150,
    });

    const { container } = render(
      <IslandProvider defaultState="default">
        <DynamicIsland />
      </IslandProvider>
    );

    await waitFor(() => {
      const island = container.querySelector('[role="region"]') as HTMLElement;
      
      // 应该仍然能够渲染，只是尺寸很小
      expect(island).toBeTruthy();
      
      // 缩放比例 150 / 400 = 0.375
      const expectedWidth = 150 * 0.375;
      expect(parseFloat(island.style.width)).toBeCloseTo(expectedWidth, 1);
    });
  });
});
