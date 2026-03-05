import React, { useEffect } from 'react';
import type { ModuleProps } from './types';

/**
 * ToastModuleProps - ToastModule 组件的 props
 * 
 * **Validates: Requirements 6.1, 6.2, 6.3, 6.4, 6.5**
 */
export interface ToastModuleProps extends ModuleProps {
  /** 消息文本 */
  message: string;
  /** 变体类型 */
  variant?: 'success' | 'error' | 'warning' | 'info';
  /** 自动关闭时长（毫秒），默认 3000ms */
  duration?: number;
  /** 自定义图标 */
  icon?: React.ReactNode;
}

/**
 * ToastModule - 全局通知模块
 * 
 * 功能：
 * - compact 状态：显示图标 + 文本（最多 30 字符）
 * - 根据 variant 选择对应图标（success/error/warning/info）
 * - 自动关闭定时器（默认 3000ms）
 * - 定时器到期后调用 onDismiss
 * 
 * **Validates: Requirements 6.1, 6.2, 6.3, 6.4, 6.5**
 */
export const ToastModule: React.FC<ToastModuleProps> = ({
  state,
  message,
  variant = 'info',
  duration = 3000,
  icon,
  onDismiss,
}) => {
  // 自动关闭定时器
  // **Validates: Requirements 6.3, 6.4**
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, duration);

    // 清理定时器
    return () => {
      clearTimeout(timer);
    };
  }, [duration, onDismiss]);

  // 根据 variant 选择图标
  // **Validates: Requirements 6.5**
  const getVariantIcon = (): string => {
    if (icon) return ''; // 如果提供了自定义图标，不使用默认图标
    
    switch (variant) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ℹ';
      default:
        return 'ℹ';
    }
  };

  // 根据 variant 选择颜色
  const getVariantColor = (): string => {
    switch (variant) {
      case 'success':
        return 'text-green-400/80';
      case 'error':
        return 'text-red-400/80';
      case 'warning':
        return 'text-yellow-400/80';
      case 'info':
        return 'text-blue-400/80';
      default:
        return 'text-blue-400/80';
    }
  };

  // 截断文本到最多 30 字符
  // **Validates: Requirements 6.2**
  const truncateMessage = (text: string): string => {
    if (text.length <= 30) return text;
    return text.substring(0, 30) + '...';
  };

  // compact 状态渲染
  // **Validates: Requirements 6.1, 6.2**
  if (state === 'compact') {
    return (
      <div 
        className="flex items-center justify-center gap-2 text-white/90 text-sm font-medium px-4"
        role="alert"
        aria-live="polite"
        aria-label={`${variant} notification: ${message}`}
      >
        {/* 图标 */}
        {icon ? (
          <span className={getVariantColor()}>{icon}</span>
        ) : (
          <span className={`${getVariantColor()} text-lg font-bold`}>
            {getVariantIcon()}
          </span>
        )}
        
        {/* 文本内容 */}
        <span className="text-white/90">
          {truncateMessage(message)}
        </span>
      </div>
    );
  }

  // Toast 仅在 compact 状态使用
  return null;
};
