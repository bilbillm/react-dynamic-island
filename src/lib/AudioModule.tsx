import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ModuleProps } from './types';

/**
 * AudioModuleProps - AudioModule 组件的 props
 * 
 * **Validates: Requirements 7.1, 7.2, 7.3, 7.4, 7.5**
 */
export interface AudioModuleProps extends ModuleProps {
  /** 歌曲标题 */
  title: string;
  /** 艺术家名称 */
  artist: string;
  /** 专辑封面 URL */
  albumCover: string;
  /** 是否正在播放 */
  isPlaying: boolean;
  /** 播放进度（0-1） */
  progress: number;
  /** 播放/暂停回调 */
  onPlayPause: () => void;
  /** 进度拖拽回调 */
  onSeek: (position: number) => void;
  /** 上一曲回调（可选） */
  onPrevious?: () => void;
  /** 下一曲回调（可选） */
  onNext?: () => void;
}

/**
 * AudioModule - 音频播放控制模块
 * 
 * 功能：
 * - compact 状态：左侧专辑封面 + 右侧波形动画
 * - expanded 状态：专辑封面 + 歌曲信息 + 进度条 + 控制按钮
 * - 波形动画根据 isPlaying 控制
 * - 播放/暂停按钮调用 onPlayPause
 * - 进度条拖拽调用 onSeek
 * - 上一曲/下一曲按钮（如果提供回调）
 * 
 * **Validates: Requirements 7.1, 7.2, 7.3, 7.4, 7.5**
 */
export const AudioModule: React.FC<AudioModuleProps> = ({
  state,
  title,
  artist,
  albumCover,
  isPlaying,
  progress,
  onPlayPause,
  onSeek,
  onPrevious,
  onNext,
  onStateChange,
}) => {
  // 处理进度条拖拽
  // **Validates: Requirements 7.4**
  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = parseFloat(e.target.value);
    onSeek(newProgress);
  };

  // 波形动画配置
  // **Validates: Requirements 7.5**
  const waveformBars = [0.3, 0.6, 0.8, 0.5, 0.7, 0.4];

  // compact 状态渲染
  // **Validates: Requirements 7.1**
  if (state === 'compact') {
    return (
      <div 
        className="flex items-center justify-between w-full h-full px-3 cursor-pointer"
        onClick={() => onStateChange?.('expanded')}
        role="button"
        tabIndex={0}
        aria-label="展开音频控制"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onStateChange?.('expanded');
          }
        }}
      >
        {/* 左侧：专辑封面 */}
        <img 
          src={albumCover} 
          alt={`${title} album cover`}
          className="w-8 h-8 rounded object-cover ring-1 ring-white/10"
        />
        
        {/* 右侧：波形动画 */}
        <div className="flex items-center gap-1 h-full">
          {waveformBars.map((height, index) => (
            <motion.div
              key={index}
              className="w-1 bg-white rounded-full"
              initial={{ height: '20%' }}
              animate={{
                height: isPlaying ? `${height * 100}%` : '20%',
              }}
              transition={{
                duration: 0.5,
                repeat: isPlaying ? Infinity : 0,
                repeatType: 'reverse',
                ease: 'easeInOut',
                delay: index * 0.1,
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  // expanded 状态渲染
  // **Validates: Requirements 7.2**
  if (state === 'expanded') {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full p-4 text-white">
        {/* 专辑封面 */}
        <img 
          src={albumCover} 
          alt={`${title} album cover`}
          className="w-20 h-20 rounded-lg object-cover mb-3 ring-1 ring-white/10 shadow-lg"
        />
        
        {/* 歌曲信息 */}
        <div className="text-center mb-3">
          <div className="text-sm font-semibold text-white truncate max-w-[300px]">
            {title}
          </div>
          <div className="text-xs text-white/60 truncate max-w-[300px]">
            {artist}
          </div>
        </div>
        
        {/* 进度条 */}
        <div className="w-full mb-3">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={progress}
            onChange={handleProgressChange}
            className="w-full h-1 rounded-lg appearance-none cursor-pointer slider"
            aria-label="音频进度"
            style={{
              background: `linear-gradient(to right, rgba(59, 130, 246, 0.6) 0%, rgba(59, 130, 246, 0.6) ${progress * 100}%, rgba(255, 255, 255, 0.1) ${progress * 100}%, rgba(255, 255, 255, 0.1) 100%)`,
            }}
          />
        </div>
        
        {/* 控制按钮 */}
        <div className="flex items-center gap-4">
          {/* 上一曲按钮 */}
          {onPrevious && (
            <button
              onClick={onPrevious}
              className="w-11 h-11 flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full transition-all duration-200"
              aria-label="上一曲"
            >
              <svg 
                className="w-5 h-5 text-white/90" 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
              </svg>
            </button>
          )}
          
          {/* 播放/暂停按钮 */}
          <button
            onClick={onPlayPause}
            className="w-12 h-12 flex items-center justify-center bg-white/15 hover:bg-white/25 backdrop-blur-md rounded-full transition-all duration-200"
            aria-label={isPlaying ? '暂停' : '播放'}
          >
            {isPlaying ? (
              <svg 
                className="w-6 h-6 text-white" 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M6 4h4v16H6zm8 0h4v16h-4z"/>
              </svg>
            ) : (
              <svg 
                className="w-6 h-6 text-white" 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z"/>
              </svg>
            )}
          </button>
          
          {/* 下一曲按钮 */}
          {onNext && (
            <button
              onClick={onNext}
              className="w-11 h-11 flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full transition-all duration-200"
              aria-label="下一曲"
            >
              <svg 
                className="w-5 h-5 text-white/90" 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M16 18h2V6h-2zm-11-7l8.5-6v12z"/>
              </svg>
            </button>
          )}
        </div>
      </div>
    );
  }

  // default 状态不渲染内容
  return null;
};
