import { Link } from 'react-router-dom';
import { GlassCard } from '../ui/GlassCard';

/**
 * FeatureCard 组件属性
 */
interface FeatureCardProps {
  /** 卡片图标（emoji 或图标） */
  icon: string;

  /** 卡片标题 */
  title: string;

  /** 卡片描述 */
  description: string;

  /** 链接地址 */
  to: string;
}

/**
 * 功能卡片组件
 *
 * 用于首页的三个主要功能入口卡片
 * 特点：
 * - 玻璃拟态设计
 * - 悬停动画效果
 * - 可点击跳转
 *
 * @example
 * ```tsx
 * <FeatureCard
 *   icon="💻"
 *   title="项目"
 *   description="探索我的创意作品和实验"
 *   to="/projects"
 * />
 * ```
 */
export function FeatureCard({ icon, title, description, to }: FeatureCardProps) {
  return (
    <Link to={to} className="block h-full">
      <GlassCard hover className="h-full flex flex-col items-center text-center p-8">
        {/* 图标 */}
        <div className="text-6xl mb-4">{icon}</div>

        {/* 标题 */}
        <h3 className="text-2xl font-semibold text-text-primary mb-3">
          {title}
        </h3>

        {/* 描述 */}
        <p className="text-text-secondary mb-4 flex-grow">
          {description}
        </p>

        {/* 查看提示 */}
        <div className="text-sm text-primary font-medium flex items-center gap-2">
          查看详情
          <svg
            className="w-4 h-4 transition-transform group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </GlassCard>
    </Link>
  );
}
