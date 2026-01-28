import { GlassCard } from '../ui/GlassCard';
import { Badge } from '../ui/Badge';
import type { Top10MovieEntry } from '@/lib/types';

/**
 * Top10MovieCard 组件属性
 */
interface Top10MovieCardProps {
  /** 影史十佳条目 */
  entry: Top10MovieEntry;
}

/**
 * 影史十佳卡片组件
 *
 * 用于展示影史十佳电影，左侧显示编号圆框
 * 复用 horizontal 布局的样式
 *
 * @example
 * ```tsx
 * <Top10MovieCard entry={top10Entry} />
 * ```
 */
export function Top10MovieCard({ entry }: Top10MovieCardProps) {
  const { num, movie } = entry;
  const { frontmatter } = movie;

  const imagePath = frontmatter.cover
    ? `/images/records/movies/${frontmatter.cover}`
    : null;

  return (
    <GlassCard hover className="flex flex-row gap-6">
      {/* 编号圆框 */}
      <div className="flex-shrink-0 flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-glass-300 backdrop-blur-md border-2 border-glass-100 flex items-center justify-center shadow-lg">
          <span className="text-2xl font-bold text-text-primary">{num}</span>
        </div>
      </div>

      {/* 封面图片 */}
      {imagePath && (
        <div className="w-48 h-64 flex-shrink-0">
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
        {/* 标题、导演、标签 */}
        <div className="flex items-center gap-4 mb-4">
          <h3 className="text-3xl font-semibold text-text-primary truncate text-left flex-shrink-0">
            {frontmatter.title}
          </h3>
          {frontmatter.director && (
            <p className="text-text-secondary text-sm truncate text-left">
              {frontmatter.director}
            </p>
          )}
          {frontmatter.tags && frontmatter.tags.length > 0 && (
            <div className="flex gap-2 flex-wrap ml-auto">
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
          <p className="text-text-secondary text-base indent-8 flex-grow line-clamp-4">
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
