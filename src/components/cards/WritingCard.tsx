import { Link } from 'react-router-dom';
import { GlassCard } from '../ui/GlassCard';
import { Badge } from '../ui/Badge';
import type { Content } from '@/lib/types';
import type { WritingFrontmatter } from '@/lib/types';
import { WRITING_CATEGORY_MAP } from '@/lib/types';
import { formatDate } from '@/lib/date';

/**
 * WritingCard 组件属性
 */
interface WritingCardProps {
  /** 写作内容 */
  writing: Content<WritingFrontmatter>;
}

/**
 * 写作卡片组件
 *
 * 用于展示单篇写作的卡片
 * 显示标题、描述、分类、标签和阅读时间
 *
 * @example
 * ```tsx
 * <WritingCard writing={writingData} />
 * ```
 */
export function WritingCard({ writing }: WritingCardProps) {
  const { frontmatter, slug } = writing;
  const categoryLabel = WRITING_CATEGORY_MAP[frontmatter.category];

  return (
    <Link
      to={`/writing/${frontmatter.category}/${slug}`}
      className="block h-full"
    >
      <GlassCard hover className="!pt-8 !px-8 !pb-4 h-full flex flex-col">
        {/* 分类标签 */}
        <div className="mb-3">
          <Badge variant="primary">{categoryLabel}</Badge>
        </div>

        {/* 标题 */}
        <h3 className="text-xl font-semibold text-text-primary mb-3">
          {frontmatter.title}
        </h3>

        {/* 描述 */}
        <p className="text-text-secondary mb-4 flex-grow line-clamp-none">
          {frontmatter.description}
        </p>

        {/* 标签 */}
        {frontmatter.tags && frontmatter.tags.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-4">
            {frontmatter.tags.map((tag) => (
              <Badge key={tag} variant="default">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* 底部信息：阅读时间和日期 */}
        <div className="flex items-center justify-between text-sm text-text-secondary pt-4 border-t border-glass-200">
          {/* 阅读时间 */}
          {frontmatter.readTime && (
            <span>📖 {frontmatter.readTime} 分钟</span>
          )}

          {/* 日期 */}
          <span>{formatDate(frontmatter.date)}</span>
        </div>
      </GlassCard>
    </Link>
  );
}
