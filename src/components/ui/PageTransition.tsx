import { ReactNode } from 'react';

/**
 * PageTransition 组件属性
 */
interface PageTransitionProps {
  /** 子组件 */
  children: ReactNode;

  /** 自定义类名（可选） */
  className?: string;
}

/**
 * 页面过渡动画组件
 *
 * 用于包裹路由页面，提供优雅的页面切换动画
 * 效果：淡入 + 轻微上滑 + 微妙缩放
 *
 * @example
 * ```tsx
 * <Route path="/projects" element={
 *   <PageTransition>
 *     <Projects />
 *   </PageTransition>
 * } />
 * ```
 */
export function PageTransition({ children, className = '' }: PageTransitionProps) {
  return (
    <div className={`page-transition ${className}`}>
      {children}
    </div>
  );
}
