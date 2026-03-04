import React, { useContext, useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IslandContext } from './IslandProvider';
import type { IslandState } from './types';

/**
 * DynamicIslandProps - DynamicIsland 组件的 props
 */
export interface DynamicIslandProps {
  className?: string;
  style?: React.CSSProperties;
}

/**
 * 最小触摸目标尺寸常量
 * 
 * **Validates: Requirements 10.4**
 */
export const MIN_TOUCH_TARGET_SIZE = 44; // 44px × 44px

/**
 * 状态尺寸规格
 * 
 * **Validates: Requirements 1.1**
 */
const STATE_DIMENSIONS: Record<IslandState, { width: number; height: number; borderRadius: number }> = {
  default: { width: 150, height: 36, borderRadius: 24 },
  compact: { width: 200, height: 40, borderRadius: 24 },
  expanded: { width: 360, height: 160, borderRadius: 40 },
};

/**
 * DynamicIsland - 灵动岛容器组件
 * 
 * 职责：
 * - 渲染灵动岛容器
 * - 应用物理动画
 * - 管理内容过渡
 * - 响应状态变化，触发布局动画
 * - 渲染当前激活的模块内容
 * - 响应式尺寸适配
 * 
 * 实现要点：
 * - 使用 motion.div 作为根元素
 * - 应用 layout 属性启用自动布局动画
 * - 配置弹簧物理参数（stiffness: 300, damping: 20）
 * - 根据 currentState 动态计算宽度、高度和圆角
 * - 实现居中定位（fixed + transform）
 * - 使用 AnimatePresence 包裹模块内容，配置 mode="wait"
 * - 实现内容 opacity 过渡（0.2s）
 * - 添加 ARIA role 和 label 属性
 * - 实现键盘焦点支持和 Escape 键关闭
 * - 实现响应式尺寸缩放和视口监听
 * 
 * **Validates: Requirements 1.1, 1.2, 1.3, 1.4, 1.5, 4.1, 4.2, 4.4, 8.1, 8.2, 8.3, 8.4, 8.5, 10.1, 10.3, 10.4, 10.5, 11.1, 11.2, 11.3**
 */
export const DynamicIsland: React.FC<DynamicIslandProps> = ({ className, style }) => {
  // 获取 Context
  const context = useContext(IslandContext);
  
  if (!context) {
    throw new Error(
      'DynamicIsland must be used within IslandProvider. ' +
      'Please wrap your component tree with <IslandProvider>.'
    );
  }

  const { activeModule, moduleProps, currentState, updateModule, setState } = context;
  const containerRef = useRef<HTMLDivElement>(null);
  
  // 响应式缩放比例
  // **Validates: Requirements 10.1, 10.3**
  const [scale, setScale] = useState(1);
  const [viewportWidth, setViewportWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 400
  );

  // 防抖处理视口变化
  // **Validates: Requirements 10.3**
  const handleResize = useCallback(() => {
    const width = window.innerWidth;
    setViewportWidth(width);
    
    // 小于 400px 时按比例缩放
    // **Validates: Requirements 10.1**
    if (width < 400) {
      setScale(width / 400);
    } else {
      setScale(1);
    }
  }, []);

  // 监听视口变化
  // **Validates: Requirements 10.1, 10.3**
  useEffect(() => {
    // 初始化
    handleResize();

    // 使用防抖优化频繁调整
    let timeoutId: number;
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(handleResize, 100);
    };

    // 使用 ResizeObserver 监听视口变化
    if (typeof ResizeObserver !== 'undefined') {
      const resizeObserver = new ResizeObserver(debouncedResize);
      resizeObserver.observe(document.documentElement);
      
      return () => {
        clearTimeout(timeoutId);
        resizeObserver.disconnect();
      };
    } else {
      // 降级到 window resize 事件
      window.addEventListener('resize', debouncedResize);
      return () => {
        clearTimeout(timeoutId);
        window.removeEventListener('resize', debouncedResize);
      };
    }
  }, [handleResize]);

  // 获取当前状态的尺寸规格
  // **Validates: Requirements 1.1**
  let dimensions = STATE_DIMENSIONS[currentState];
  
  // 极小视口适配：小于 360px 时调整 expanded 状态宽度
  // **Validates: Requirements 10.5**
  if (viewportWidth < 360 && currentState === 'expanded') {
    const safeMargin = 20;
    const maxWidth = viewportWidth - safeMargin * 2;
    dimensions = {
      ...dimensions,
      width: Math.min(dimensions.width, maxWidth),
    };
  }
  
  // 应用响应式缩放
  // **Validates: Requirements 10.1**
  const scaledDimensions = {
    width: dimensions.width * scale,
    height: dimensions.height * scale,
    borderRadius: dimensions.borderRadius * scale,
  };

  // 处理 Escape 键关闭
  // **Validates: Requirements 11.3**
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && activeModule) {
        updateModule(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeModule, updateModule]);

  // 模块的标准 props
  const moduleStandardProps = {
    state: currentState,
    onDismiss: () => updateModule(null),
    onStateChange: setState,
  };

  // 合并模块 props（确保 moduleProps 不为 null）
  const finalModuleProps = {
    ...moduleStandardProps,
    ...(moduleProps || {}),
  };

  // 判断是否有交互内容（用于键盘焦点）
  // **Validates: Requirements 11.2**
  const hasInteractiveContent = activeModule !== null;

  return (
    <motion.div
      ref={containerRef}
      // 应用 layout 属性启用自动布局动画
      // **Validates: Requirements 1.2, 8.1**
      layout
      // 配置弹簧物理参数
      // **Validates: Requirements 1.2, 8.2**
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20,
      }}
      // 动态样式：宽度、高度、圆角
      // **Validates: Requirements 1.1, 1.3, 10.1**
      style={{
        width: `${scaledDimensions.width}px`,
        height: `${scaledDimensions.height}px`,
        borderRadius: `${scaledDimensions.borderRadius}px`,
        // 居中定位（fixed + transform）
        // **Validates: Requirements 1.4**
        position: 'fixed',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: '#000',
        overflow: 'hidden',
        zIndex: 9999,
        // 200ms 内完成尺寸适配
        // **Validates: Requirements 10.3**
        transition: 'width 0.2s ease-out, height 0.2s ease-out, border-radius 0.2s ease-out',
        ...style,
      }}
      className={className}
      // ARIA 属性
      // **Validates: Requirements 11.1**
      role="region"
      aria-label="Dynamic Island"
      aria-live="polite"
      // 键盘焦点支持
      // **Validates: Requirements 11.2**
      tabIndex={hasInteractiveContent ? 0 : -1}
    >
      {/* AnimatePresence 包裹模块内容，配置 mode="wait" */}
      {/* **Validates: Requirements 4.2, 8.4** */}
      <AnimatePresence mode="wait">
        {activeModule && (
          <motion.div
            key={activeModule.name || 'module'}
            // 内容 opacity 过渡（0.2s）
            // **Validates: Requirements 4.4, 8.3**
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* 渲染模块组件 */}
            {/* **Validates: Requirements 4.1** */}
            {React.createElement(activeModule, finalModuleProps)}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
