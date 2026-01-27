import { ReactNode, CSSProperties } from 'react';

/**
 * AnimatedWrapper 组件属性
 */
interface AnimatedWrapperProps {
  /** 子组件 */
  children: ReactNode;

  /** 动画延迟（毫秒） */
  delay?: number;

  /** 动画类型 */
  animation?: 'fade-in' | 'fade-in-up' | 'fade-in-scale';

  /** 自定义类名（可选） */
  className?: string;
}

/**
 * 通用动画包裹组件
 *
 * 用于为任何子组件添加进入动画
 * 支持延迟动画，实现交错效果
 *
 * @example
 * ```tsx
 * {items.map((item, index) => (
 *   <AnimatedWrapper
 *     key={item.id}
 *     delay={index * 100}
 *     animation="fade-in-up"
 *   >
 *     <Card>{item.content}</Card>
 *   </AnimatedWrapper>
 * ))}
 * ```
 */
export function AnimatedWrapper({
  children,
  delay = 0,
  animation = 'fade-in-up',
  className = '',
}: AnimatedWrapperProps) {
  const delayStyle: CSSProperties = delay > 0 ? { animationDelay: `${delay}ms` } : {};

  return (
    <div
      className={`animated-${animation} ${className}`.trim()}
      style={delayStyle}
    >
      {children}
    </div>
  );
}
