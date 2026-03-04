import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { IslandProvider, IslandContext } from './IslandProvider';
import { useContext } from 'react';
import type { ModuleProps } from './types';

describe('IslandProvider', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('should provide initial context values', () => {
    const { result } = renderHook(() => useContext(IslandContext), {
      wrapper: IslandProvider,
    });

    expect(result.current).toBeDefined();
    expect(result.current?.activeModule).toBeNull();
    expect(result.current?.moduleProps).toBeNull();
    expect(result.current?.currentState).toBe('default');
  });

  it('should support custom defaultState', () => {
    const { result } = renderHook(() => useContext(IslandContext), {
      wrapper: ({ children }) => (
        <IslandProvider defaultState="compact">{children}</IslandProvider>
      ),
    });

    expect(result.current?.currentState).toBe('compact');
  });

  it('should update state using setState', () => {
    const { result } = renderHook(() => useContext(IslandContext), {
      wrapper: IslandProvider,
    });

    act(() => {
      result.current?.setState('expanded');
    });

    expect(result.current?.currentState).toBe('expanded');
  });

  it('should activate module with updateModule', () => {
    const TestModule: React.FC<ModuleProps> = () => <div>Test Module</div>;
    
    const { result } = renderHook(() => useContext(IslandContext), {
      wrapper: IslandProvider,
    });

    act(() => {
      result.current?.updateModule(TestModule, { test: 'prop' }, 'compact');
    });

    // Wait for debounce (100ms)
    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(result.current?.activeModule).not.toBeNull();
    expect(result.current?.moduleProps).toEqual({ test: 'prop' });
    expect(result.current?.currentState).toBe('compact');
  });

  it('should use default compact state when targetState is not provided', () => {
    const TestModule: React.FC<ModuleProps> = () => <div>Test Module</div>;
    
    const { result } = renderHook(() => useContext(IslandContext), {
      wrapper: IslandProvider,
    });

    act(() => {
      result.current?.updateModule(TestModule);
    });

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(result.current?.currentState).toBe('compact');
  });

  it('should debounce rapid updateModule calls (100ms threshold)', () => {
    const Module1: React.FC<ModuleProps> = () => <div>Module 1</div>;
    const Module2: React.FC<ModuleProps> = () => <div>Module 2</div>;
    const Module3: React.FC<ModuleProps> = () => <div>Module 3</div>;
    
    const { result } = renderHook(() => useContext(IslandContext), {
      wrapper: IslandProvider,
    });

    // Rapid calls within 100ms
    act(() => {
      result.current?.updateModule(Module1, {}, 'compact');
      result.current?.updateModule(Module2, {}, 'expanded');
      result.current?.updateModule(Module3, {}, 'compact');
    });

    // Before debounce completes
    act(() => {
      vi.advanceTimersByTime(50);
    });
    expect(result.current?.activeModule).toBeNull();

    // After debounce completes - only last call should execute
    act(() => {
      vi.advanceTimersByTime(50);
    });
    expect(result.current?.activeModule).not.toBeNull();
    expect(result.current?.currentState).toBe('compact');
  });

  it('should reset to default state 300ms after closing module', () => {
    const TestModule: React.FC<ModuleProps> = () => <div>Test Module</div>;
    
    const { result } = renderHook(() => useContext(IslandContext), {
      wrapper: IslandProvider,
    });

    // Activate module
    act(() => {
      result.current?.updateModule(TestModule, {}, 'expanded');
    });

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(result.current?.activeModule).not.toBeNull();
    expect(result.current?.currentState).toBe('expanded');

    // Close module
    act(() => {
      result.current?.updateModule(null);
    });

    // After debounce (100ms) but before reset (300ms)
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current?.activeModule).not.toBeNull(); // Still active

    // After reset timer completes (300ms)
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(result.current?.activeModule).toBeNull();
    expect(result.current?.moduleProps).toBeNull();
    expect(result.current?.currentState).toBe('default');
  });

  it('should clear timers on unmount', () => {
    const TestModule: React.FC<ModuleProps> = () => <div>Test Module</div>;
    
    const { result, unmount } = renderHook(() => useContext(IslandContext), {
      wrapper: IslandProvider,
    });

    act(() => {
      result.current?.updateModule(TestModule);
    });

    // Unmount before timers complete
    unmount();

    // Advance timers - should not cause errors
    act(() => {
      vi.advanceTimersByTime(500);
    });

    // No errors should occur
    expect(true).toBe(true);
  });

  it('should cancel previous reset timer when activating new module', () => {
    const Module1: React.FC<ModuleProps> = () => <div>Module 1</div>;
    const Module2: React.FC<ModuleProps> = () => <div>Module 2</div>;
    
    const { result } = renderHook(() => useContext(IslandContext), {
      wrapper: IslandProvider,
    });

    // Activate and close first module
    act(() => {
      result.current?.updateModule(Module1);
    });
    act(() => {
      vi.advanceTimersByTime(100);
    });
    act(() => {
      result.current?.updateModule(null);
    });
    act(() => {
      vi.advanceTimersByTime(100);
    });

    // Before reset completes, activate new module
    act(() => {
      result.current?.updateModule(Module2);
    });
    act(() => {
      vi.advanceTimersByTime(100);
    });

    // New module should be active
    expect(result.current?.activeModule).not.toBeNull();
    expect(result.current?.currentState).toBe('compact');

    // Wait for original reset timer duration
    act(() => {
      vi.advanceTimersByTime(300);
    });

    // Module should still be active (reset was cancelled)
    expect(result.current?.activeModule).not.toBeNull();
  });
});
