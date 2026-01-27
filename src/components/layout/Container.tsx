import React from 'react';

/**
 * Container 容器组件属性
 */
interface ContainerProps {
  /** 容器内容 */
  children: React.ReactNode;

  /** 自定义类名（可选） */
  className?: string;

  /** 容器大小变体 */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

/**
 * Container 容器组件
 *
 * 用于包裹页面内容，提供统一的宽度和居中对齐
 * 响应式设计，在不同屏幕上自动调整
 *
 * @example
 * ```tsx
 * <Container size="lg">
 *   <p>内容</p>
 * </Container>
 * ```
 */
export function Container({
  children,
  className = '',
  size = 'lg',
}: ContainerProps) {
  // 根据大小定义最大宽度
  const sizeClasses = {
    sm: 'max-w-4xl',
    md: 'max-w-5xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-full',
  };

  return (
    <div
      className={`
        container
        mx-auto
        px-6
        ${sizeClasses[size]}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
    >
      {children}
    </div>
  );
}
