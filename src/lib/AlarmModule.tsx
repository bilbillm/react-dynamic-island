import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { ModuleProps } from './types';

/**
 * AlarmModuleProps - AlarmModule 组件的 props
 * 
 * **Validates: Requirements 5.1, 5.2, 5.3, 5.4, 5.5**
 */
export interface AlarmModuleProps extends ModuleProps {
  /** 倒计时秒数 */
  duration: number;
  /** 倒计时归零时的回调 */
  onComplete?: () => void;
  /** 稍后提醒时的回调 */
  onSnooze?: (additionalMinutes: number) => void;
}

/**
 * AlarmModule - 闹钟倒计时模块
 * 
 * 功能：
 * - compact 状态：显示 "⏱️ MM:SS" 格式的倒计时
 * - expanded 状态：显示大号数字时间 + "停止" 和 "稍后提醒" 按钮
 * - 倒计时归零时调用 onComplete
 * - "停止" 按钮调用 onDismiss 并停止定时器
 * - "稍后提醒" 按钮增加 300 秒（5 分钟）并调用 onStateChange('compact')
 * 
 * **Validates: Requirements 5.1, 5.2, 5.3, 5.4, 5.5**
 */
export const AlarmModule: React.FC<AlarmModuleProps> = ({
  state,
  duration,
  onDismiss,
  onStateChange,
  onComplete,
  onSnooze,
}) => {
  // 倒计时状态
  const [remainingSeconds, setRemainingSeconds] = useState(duration);

  // 倒计时逻辑
  // **Validates: Requirements 5.3**
  useEffect(() => {
    // 如果剩余时间为 0，调用 onComplete
    if (remainingSeconds <= 0) {
      onComplete?.();
      return;
    }

    // 设置定时器
    const timer = setInterval(() => {
      setRemainingSeconds((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          // 倒计时归零，调用 onComplete
          onComplete?.();
          return 0;
        }
        return next;
      });
    }, 1000);

    // 清理定时器
    return () => {
      clearInterval(timer);
    };
  }, [remainingSeconds, onComplete]);

  // 格式化时间为 MM:SS
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // 停止按钮处理
  // **Validates: Requirements 5.4**
  const handleStop = () => {
    onDismiss();
  };

  // 稍后提醒按钮处理
  // **Validates: Requirements 5.5**
  const handleSnooze = () => {
    // 增加 300 秒（5 分钟）
    setRemainingSeconds((prev) => prev + 300);
    onSnooze?.(5);
    // 切换到 compact 状态
    onStateChange?.('compact');
  };

  // compact 状态渲染
  // **Validates: Requirements 5.1**
  // expanded 状态渲染
  // **Validates: Requirements 5.2**
  return (
    <AnimatePresence mode="wait">
      {state === 'compact' && (
        <motion.div
          key="compact"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="flex items-center justify-center text-white/90 text-sm font-medium cursor-pointer"
          onClick={() => onStateChange?.('expanded')}
          role="button"
          tabIndex={0}
          aria-label="展开闹钟控制"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onStateChange?.('expanded');
            }
          }}
        >
          ⏱️ {formatTime(remainingSeconds)}
        </motion.div>
      )}

      {state === 'expanded' && (
        <motion.div
          key="expanded"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="flex flex-col items-center justify-center w-full h-full p-4 text-white"
        >
          {/* 大号数字时间 */}
          <div className="text-5xl font-bold mb-6">
            {formatTime(remainingSeconds)}
          </div>
          
          {/* 按钮组 */}
          <div className="flex gap-3">
            {/* 停止按钮 */}
            <button
              onClick={handleStop}
              className="px-6 py-2 bg-red-500/20 hover:bg-red-500/30 backdrop-blur-md rounded-full text-sm font-medium text-white/90 transition-all duration-200 min-w-[44px] min-h-[44px]"
              aria-label="停止闹钟"
            >
              停止
            </button>
            
            {/* 稍后提醒按钮 */}
            <button
              onClick={handleSnooze}
              className="px-6 py-2 bg-blue-500/20 hover:bg-blue-500/30 backdrop-blur-md rounded-full text-sm font-medium text-white/90 transition-all duration-200 min-w-[44px] min-h-[44px]"
              aria-label="稍后提醒"
            >
              稍后提醒
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
