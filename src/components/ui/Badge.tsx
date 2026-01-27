
/**
 * Badge 组件属性
 */
interface BadgeProps {
  /** 标签文本 */
  children: React.ReactNode;

  /** 自定义类名（可选） */
  className?: string;

  /** 标签变体 */
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'blue' | 'green' | 'white' | 'pink';
}

/**
 * 标签徽章组件
 *
 * 用于显示技术标签、分类、状态等小标签
 * 采用玻璃拟态设计风格
 *
 * @example
 * ```tsx
 * <Badge variant="primary">React</Badge>
 * <Badge variant="success">已完成</Badge>
 * <Badge variant="blue">蓝色标签</Badge>
 * ```
 */
export function Badge({
  children,
  className = '',
  variant = 'default',
}: BadgeProps) {
  // 根据变体定义颜色方案
  const variantClasses = {
    default: 'bg-glass-100 text-text-secondary border-glass-200',
    primary: 'bg-primary/20 text-primary border-primary/30',
    success: 'bg-green-500/20 text-green-400 border-green-500/30',
    warning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    danger: 'bg-red-500/20 text-red-400 border-red-500/30',
    blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    green: 'bg-green-500/20 text-green-400 border-green-500/30',
    white: 'bg-white/80 text-text-primary border-white/90',
    pink: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  };

  return (
    <span
      className={`
        inline-flex
        items-center
        px-3
        py-1
        text-sm
        font-medium
        rounded-full
        border
        backdrop-blur-sm
        transition-all
        duration-200
        hover:scale-105
        ${variantClasses[variant]}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
    >
      {children}
    </span>
  );
}
