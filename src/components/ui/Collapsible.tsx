import { useState } from 'react';

/**
 * Collapsible 组件属性
 */
interface CollapsibleProps {
  /** 标题 */
  title: string;
  /** 子内容 */
  children: React.ReactNode;
  /** 默认是否展开 */
  defaultExpanded?: boolean;
  /** 额外的类名 */
  className?: string;
}

/**
 * 可折叠容器组件
 *
 * 提供可折叠/展开的内容区域，点击标题栏切换状态
 * 支持平滑的动画过渡效果
 *
 * @example
 * ```tsx
 * <Collapsible title="影史十佳" defaultExpanded={true}>
 *   <div>内容...</div>
 * </Collapsible>
 * ```
 */
export function Collapsible({
  title,
  children,
  defaultExpanded = true,
  className = '',
}: CollapsibleProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className={`glass-card ${className}`}>
      {/* 标题栏 - 可点击切换 */}
      <div
        className="flex items-center justify-between cursor-pointer p-6"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h2 className="text-2xl font-bold text-text-primary">{title}</h2>
        <span
          className={`transition-transform duration-300 ${
            isExpanded ? 'rotate-180' : ''
          }`}
        >
          ▼
        </span>
      </div>

      {/* 可折叠内容区域 */}
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isExpanded ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="p-6 pt-0">{children}</div>
      </div>
    </div>
  );
}
