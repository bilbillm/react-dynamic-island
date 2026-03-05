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
 * 圆角设计原则：使用连续曲率，圆角半径约为高度的 55-60%
 * 这样可以确保圆角与直线的连接更加平滑自然
 * 
 * **Validates: Requirements 1.1**
 */
const STATE_DIMENSIONS: Record<IslandState, { width: number; height: number; borderRadius: number }> = {
  default: { width: 150, height: 36, borderRadius: 20 },   // 20/36 ≈ 55%
  compact: { width: 200, height: 40, borderRadius: 22 },   // 22/40 = 55%
  expanded: { width: 360, height: 160, borderRadius: 44 }, // 44/160 ≈ 27.5% (更大的形状需要相对更小的圆角比例)
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
      // 初始状态和动画状态都保持居中，并控制圆角
      initial={{
        x: '-50%',
        borderRadius: `${scaledDimensions.borderRadius}px`,
      }}
      animate={{
        x: '-50%',
        width: `${scaledDimensions.width}px`,
        height: `${scaledDimensions.height}px`,
        borderRadius: `${scaledDimensions.borderRadius}px`,
      }}
      // 配置弹簧物理参数 - 强烈回弹 + 圆角平滑
      // **Validates: Requirements 1.2, 8.2**
      transition={{
        width: {
          type: 'spring',
          stiffness: 350,   // 高刚度 = 强烈回弹
          damping: 25,      // 低阻尼 = 更多振荡
          mass: 0.8,
        },
        height: {
          type: 'spring',
          stiffness: 350,
          damping: 25,
          mass: 0.8,
        },
        borderRadius: {
          type: 'spring',
          stiffness: 370,   // 圆角稍快，提前完成
          damping: 30,      // 稍高阻尼避免圆角过度振荡
          mass: 0.6,
        },
        x: {
          type: 'tween',
          duration: 0,
        },
      }}
      // 动态样式
      // **Validates: Requirements 1.1, 1.3, 10.1**
      style={{
        // 居中定位（fixed + transform）
        // **Validates: Requirements 1.4**
        position: 'fixed',
        top: '20px',
        left: '50%',
        zIndex: 9999,
        // Enhanced acrylic glass effect
        background: 'rgba(28, 28, 30, 0.7)',
        backdropFilter: 'blur(40px) saturate(180%)',
        WebkitBackdropFilter: 'blur(40px) saturate(180%)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: `
          0 8px 32px rgba(0, 0, 0, 0.4),
          inset 0 1px 0 rgba(255, 255, 255, 0.1),
          inset 0 -1px 0 rgba(0, 0, 0, 0.2)
        `,
        overflow: 'hidden',
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
      {/* Soft edge gradient - 柔化圆角与直线的连接 */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 0%, transparent 70%, rgba(0,0,0,0.03) 85%, rgba(0,0,0,0.06) 100%)',
          borderRadius: 'inherit',
        }}
      />

      {/* Edge highlight gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 50%)',
          borderRadius: 'inherit',
        }}
      />

      {/* Noise texture layer */}
      <div
        className="absolute inset-0 pointer-events-none select-none"
        style={{
          opacity: 0.03,
          mixBlendMode: 'overlay',
          borderRadius: 'inherit',
        }}
      >
        <svg
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          <filter id="island-noise">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.7"
              numOctaves="3"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect
            width="100%"
            height="100%"
            filter="url(#island-noise)"
          />
        </svg>
      </div>

      {/* AnimatePresence 包裹模块内容，配置 mode="wait" */}
      {/* **Validates: Requirements 4.2, 8.4** */}
      <AnimatePresence mode="wait">
        {activeModule && finalModuleProps.state && (
          <motion.div
            key={activeModule.name || 'module'}
            layout="position"
            // 内容 opacity 过渡（0.2s）
            // **Validates: Requirements 4.4, 8.3**
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ 
              opacity: { duration: 0.2 },
              layout: { duration: 0 }
            }}
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              zIndex: 1,
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
