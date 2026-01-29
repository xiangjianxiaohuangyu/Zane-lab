import { GlassCard } from '../ui/GlassCard';
import { Badge } from '../ui/Badge';
import type { Top10GameEntry } from '@/lib/types';

/**
 * Top10GameCard 组件属性
 */
interface Top10GameCardProps {
  /** 十佳游戏条目 */
  entry: Top10GameEntry;
}

/**
 * 心目中的十佳游戏卡片组件
 *
 * 用于展示十佳游戏，左侧显示编号圆框
 * 复用 horizontal 布局的样式
 *
 * @example
 * ```tsx
 * <Top10GameCard entry={top10Entry} />
 * ```
 */
export function Top10GameCard({ entry }: Top10GameCardProps) {
  const { num, game } = entry;
  const { frontmatter } = game;

  const imagePath = frontmatter.cover
    ? `/images/records/games/${frontmatter.cover}`
    : null;

  return (
    <GlassCard hover className="flex flex-col md:flex-row gap-4 md:gap-6">
      {/* 编号圆框 */}
      <div className="flex-shrink-0 flex items-center justify-center">
        <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-glass-300 backdrop-blur-md border-2 border-glass-100 flex items-center justify-center shadow-lg">
          <span className="text-xl md:text-2xl font-bold text-text-primary">{num}</span>
        </div>
      </div>

      {/* 封面图片 */}
      {imagePath && (
        <div className="w-32 h-44 md:w-48 md:h-64 flex-shrink-0 mx-auto md:mx-0">
          <img
            src={imagePath}
            alt={frontmatter.title}
            className="w-full h-full object-contain"
            loading="lazy"
          />
        </div>
      )}

      {/* 内容区域 */}
      <div className="flex flex-col flex-1">
        {/* 标题、开发商、标签 */}
        <div className="flex flex-col items-center gap-2 md:gap-4 md:flex-row md:items-center mb-4">
          <h3 className="text-2xl md:text-3xl font-semibold text-text-primary text-center md:text-left">
            {frontmatter.title}
          </h3>
          {frontmatter.developer && (
            <p className="text-text-secondary text-sm truncate whitespace-nowrap text-center md:text-left">
              {frontmatter.developer}
            </p>
          )}
          {frontmatter.tags && frontmatter.tags.length > 0 && (
            <div className="flex gap-2 flex-wrap justify-center md:ml-auto">
              {frontmatter.tags.map((tag) => (
                <Badge key={tag} variant="default">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* 感想 */}
        {frontmatter.notes && (
          <p className="text-text-secondary text-sm md:text-base indent-4 md:indent-8 flex-grow">
            {frontmatter.notes}
          </p>
        )}

        {/* 日期 */}
        <div className="text-sm text-text-secondary text-right mt-auto">
          {new Date(frontmatter.date).toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </div>
      </div>
    </GlassCard>
  );
}
