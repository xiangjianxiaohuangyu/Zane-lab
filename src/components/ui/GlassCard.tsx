
/**
 * GlassCard 组件属性
 */
interface GlassCardProps {
  /** 卡片内容 */
  children: React.ReactNode;

  /** 自定义类名（可选） */
  className?: string;

  /** 是否启用悬停效果（默认启用） */
  hover?: boolean;

  /** 点击事件处理（可选） */
  onClick?: () => void;

  /** 卡片变体 */
  variant?: 'default' | 'featured' | 'subtle';
}

/**
 * 玻璃拟态卡片组件
 *
 * 实现玻璃拟态设计风格的核心组件
 * 特点：
 * - 半透明背景
 * - 背景模糊效果
 * - 柔和边框
 * - 平滑的悬停动画
 *
 * @example
 * ```tsx
 * <GlassCard hover>
 *   <h2>标题</h2>
 *   <p>内容</p>
 * </GlassCard>
 * ```
 */
export function GlassCard({
  children,
  className = '',
  hover = true,
  onClick,
  variant = 'default',
}: GlassCardProps) {
  // 基础样式类
  const baseClasses = `
    glass-card
    rounded-2xl
    p-4
    shadow-xl
    transition-all
    duration-300
    ${hover ? 'glass-card-hover cursor-pointer' : ''}
    ${onClick ? 'cursor-pointer' : ''}
  `;

  // 根据变体添加不同的样式
  const variantClasses = {
    default: 'bg-glass-100 border border-glass-200',
    featured: 'bg-glass-200 border border-glass-300',
    subtle: 'bg-glass-100/50 border border-glass-200/50',
  };

  // 合并所有类名
  const combinedClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div className={combinedClasses} onClick={onClick}>
      {children}
    </div>
  );
}
