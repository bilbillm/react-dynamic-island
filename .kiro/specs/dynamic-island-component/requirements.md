# Requirements Document

## Introduction

本文档定义了一个高度定制化、支持插拔的网页端灵动岛 (Dynamic Island) 开源组件库的需求。该组件库基于 React 18 和 Framer Motion 构建，提供流畅的物理动画和模块化的内容展示能力，使开发者能够在 Web 应用中实现类似 Apple Dynamic Island 的交互体验。

## Glossary

- **Dynamic_Island**: 灵动岛主容器组件，负责物理形态变化和动画表现
- **Island_Provider**: 全局状态管理组件，提供灵动岛的上下文
- **Module**: 可插拔的功能模块，定义灵动岛内部展示的具体内容
- **Island_State**: 灵动岛的物理状态（default/compact/expanded）
- **useIsland_Hook**: 核心 API Hook，用于在任何组件中控制灵动岛
- **Alarm_Module**: 内置的闹钟倒计时模块
- **Toast_Module**: 内置的全局通知模块
- **Audio_Module**: 内置的音频播放模块
- **Layout_Animation**: Framer Motion 的自动布局动画系统
- **Spring_Physics**: 弹簧物理引擎，用于实现自然的动画效果

## Requirements

### Requirement 1: 灵动岛容器状态管理

**User Story:** 作为开发者，我希望灵动岛容器能够在不同物理状态之间流畅切换，以便为用户提供自然的视觉反馈。

#### Acceptance Criteria

1. THE Dynamic_Island SHALL support three distinct physical states: default (150px × 36px, 24px border-radius), compact (200px × 40px), and expanded (360px × 160px, 40px border-radius)
2. WHEN the Island_State changes, THE Dynamic_Island SHALL animate the transition using Framer Motion layout property with spring physics (stiffness: 300, damping: 20)
3. WHEN transitioning between states, THE Dynamic_Island SHALL maintain smooth corner radius interpolation
4. THE Dynamic_Island SHALL preserve its centered position on screen during all state transitions
5. FOR ALL state transitions, the animation duration SHALL complete within 0.3 to 0.6 seconds based on spring physics

### Requirement 2: 全局状态管理系统

**User Story:** 作为开发者，我希望通过简单的 Context API 管理灵动岛的全局状态，以便在应用的任何位置控制它。

#### Acceptance Criteria

1. THE Island_Provider SHALL wrap the application root and provide global state context
2. THE Island_Provider SHALL maintain the current active Module reference
3. THE Island_Provider SHALL maintain the current Island_State value
4. WHEN a Module is activated, THE Island_Provider SHALL update the active Module and trigger appropriate state transition
5. WHEN a Module is dismissed, THE Island_Provider SHALL reset to default state within 300ms

### Requirement 3: useIsland Hook API

**User Story:** 作为开发者，我希望使用简洁的 Hook API 来控制灵动岛，以便快速集成功能。

#### Acceptance Criteria

1. THE useIsland_Hook SHALL provide a `show` method that accepts Module component and optional configuration
2. THE useIsland_Hook SHALL provide a `hide` method that dismisses the current Module
3. THE useIsland_Hook SHALL provide a `state` property that returns the current Island_State
4. WHEN `show` is called with a Module, THE useIsland_Hook SHALL activate that Module and transition to appropriate state
5. WHEN `hide` is called, THE useIsland_Hook SHALL trigger dismissal animation and reset to default state

### Requirement 4: 模块化内容系统

**User Story:** 作为开发者，我希望灵动岛内容完全解耦为独立模块，以便轻松扩展和定制功能。

#### Acceptance Criteria

1. THE Dynamic_Island SHALL render Module components as children without coupling to specific Module implementations
2. WHEN a Module is mounted, THE Dynamic_Island SHALL apply AnimatePresence with mode="wait" for content transitions
3. THE Module SHALL define its preferred Island_State through props or configuration
4. WHEN Module content changes, THE Dynamic_Island SHALL animate opacity transitions faster than container shape transitions
5. THE Dynamic_Island SHALL support custom Module components provided by developers

### Requirement 5: Alarm Module 实现

**User Story:** 作为用户，我希望在灵动岛中看到倒计时闹钟，以便快速了解剩余时间。

#### Acceptance Criteria

1. WHEN Alarm_Module is in compact state, THE Alarm_Module SHALL display countdown timer with format "⏱️ MM:SS"
2. WHEN Alarm_Module is in expanded state, THE Alarm_Module SHALL display digital time with "停止" and "稍后提醒" buttons
3. WHEN countdown reaches zero, THE Alarm_Module SHALL trigger a completion callback
4. WHEN "停止" button is clicked, THE Alarm_Module SHALL dismiss itself and stop the timer
5. WHEN "稍后提醒" button is clicked, THE Alarm_Module SHALL add 5 minutes to countdown and return to compact state

### Requirement 6: Toast Module 实现

**User Story:** 作为用户，我希望在灵动岛中看到操作反馈通知，以替代传统的顶部 Toast。

#### Acceptance Criteria

1. WHEN Toast_Module is activated, THE Toast_Module SHALL transition to compact state
2. THE Toast_Module SHALL display an icon and short text message (maximum 30 characters)
3. WHEN Toast_Module is displayed, THE Toast_Module SHALL automatically dismiss after 3 seconds
4. WHEN auto-dismiss timer completes, THE Toast_Module SHALL animate out and unmount itself
5. THE Toast_Module SHALL support success, error, warning, and info variants with corresponding icons

### Requirement 7: Audio Module 实现

**User Story:** 作为用户，我希望在灵动岛中控制音频播放，以便快速访问播放控件。

#### Acceptance Criteria

1. WHEN Audio_Module is in compact state, THE Audio_Module SHALL display album cover on left and waveform animation on right
2. WHEN Audio_Module is in expanded state, THE Audio_Module SHALL display progress bar and playback controls (previous, play/pause, next)
3. WHEN play/pause button is clicked, THE Audio_Module SHALL toggle playback state and update icon
4. WHEN progress bar is dragged, THE Audio_Module SHALL update playback position in real-time
5. THE Audio_Module SHALL animate waveform bars synchronized with audio playback

### Requirement 8: 动画物理引擎规格

**User Story:** 作为用户，我希望所有动画都具有自然的物理特性，以获得流畅的视觉体验。

#### Acceptance Criteria

1. THE Dynamic_Island SHALL use Framer Motion layout property for all width, height, and border-radius transitions
2. THE Dynamic_Island SHALL apply spring physics with stiffness 300 and damping 20 to all layout animations
3. WHEN content opacity changes, THE Dynamic_Island SHALL complete opacity transition before layout animation completes
4. THE Dynamic_Island SHALL use AnimatePresence for mounting and unmounting Module components
5. FOR ALL animations, the spring physics SHALL produce subtle bounce effect characteristic of Apple design language

### Requirement 9: TypeScript 类型系统

**User Story:** 作为开发者，我希望拥有完整的 TypeScript 类型定义，以便获得类型安全和 IDE 智能提示。

#### Acceptance Criteria

1. THE component library SHALL export IslandState type with literal values: "default", "compact", "expanded"
2. THE component library SHALL export ModuleProps interface defining standard Module component props
3. THE component library SHALL export IslandContextType interface defining context shape
4. THE component library SHALL export UseIslandReturn interface defining useIsland_Hook return type
5. THE component library SHALL provide generic type parameters for custom Module props

### Requirement 10: 响应式布局支持

**User Story:** 作为用户，我希望灵动岛在不同屏幕尺寸下都能正常工作，以便在各种设备上使用。

#### Acceptance Criteria

1. WHEN viewport width is less than 400px, THE Dynamic_Island SHALL scale down dimensions proportionally while maintaining aspect ratio
2. THE Dynamic_Island SHALL remain horizontally centered using CSS positioning
3. WHEN viewport is resized, THE Dynamic_Island SHALL smoothly adapt to new dimensions within 200ms
4. THE Dynamic_Island SHALL maintain minimum touch target size of 44px × 44px for interactive elements in all states
5. WHERE viewport width is less than 360px, THE Dynamic_Island SHALL reduce expanded state width to fit within safe margins

### Requirement 11: 可访问性支持

**User Story:** 作为使用辅助技术的用户，我希望能够通过键盘和屏幕阅读器访问灵动岛功能。

#### Acceptance Criteria

1. THE Dynamic_Island SHALL have appropriate ARIA role and label attributes
2. WHEN Dynamic_Island contains interactive Module, THE Dynamic_Island SHALL be keyboard focusable
3. WHEN focused, THE Dynamic_Island SHALL support Escape key to dismiss current Module
4. THE Module components SHALL announce state changes to screen readers using ARIA live regions
5. THE Dynamic_Island SHALL maintain focus management when Module content changes

### Requirement 12: 性能优化

**User Story:** 作为开发者，我希望组件库具有高性能，以避免影响应用的整体性能。

#### Acceptance Criteria

1. THE Dynamic_Island SHALL use React.memo to prevent unnecessary re-renders
2. THE Dynamic_Island SHALL use CSS transform and opacity for animations to leverage GPU acceleration
3. WHEN Module is not visible, THE Dynamic_Island SHALL not render Module component tree
4. THE Dynamic_Island SHALL debounce rapid state change requests with 100ms threshold
5. THE component library SHALL have bundle size less than 50KB (minified + gzipped) excluding Framer Motion dependency

