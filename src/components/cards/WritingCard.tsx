import { Link } from 'react-router-dom';
import { GlassCard } from '../ui/GlassCard';
import { Badge } from '../ui/Badge';
import type { Content } from '@/lib/types';
import type { WritingFrontmatter } from '@/lib/types';
import { formatDate } from '@/lib/date';

/**
 * WritingCard 组件属性
 */
interface WritingCardProps {
  /** 写作内容 */
  writing: Content<WritingFrontmatter>;
}

/**
 * 年终总结年份徽章
 */
function AnnualYearsBadge({ years, statusColor }: { years: string; statusColor?: WritingFrontmatter['statusColor'] }) {
  return (
    <div className="mb-3">
      <Badge variant={statusColor || 'primary'}>
        {years}
      </Badge>
    </div>
  );
}

/**
 * 年终总结底部标签
 */
function AnnualBottomTags({ tags }: { tags: string[] }) {
  return (
    <div className="mb-4 flex gap-2 flex-wrap">
      {tags.map((tag) => (
        <Badge key={tag} variant="default">
          {tag}
        </Badge>
      ))}
    </div>
  );
}

/**
 * 年终总结卡片
 */
function AnnualCard({ writing, isPoetry }: { writing: Content<WritingFrontmatter>; isPoetry: boolean }) {
  const { frontmatter, slug } = writing;

  return (
    <Link to={`/writing/${frontmatter.category}/${slug}`} className="block h-full">
      <GlassCard hover className="!pt-8 !px-8 !pb-4 h-full flex flex-col">
        {/* 年份徽章 */}
        {frontmatter.years && <AnnualYearsBadge years={frontmatter.years} statusColor={frontmatter.statusColor} />}

        {/* 标题 */}
        <h3 className="text-xl font-semibold text-text-primary mb-3">
          {frontmatter.title}
        </h3>

        {/* 描述 */}
        <p className="text-text-secondary mb-4 flex-grow line-clamp-none">
          {frontmatter.description}
        </p>

        {/* 底部标签 */}
        {frontmatter.tags && frontmatter.tags.length > 0 && <AnnualBottomTags tags={frontmatter.tags} />}

        {/* 底部信息 */}
        <div className="flex items-center justify-between text-sm text-text-secondary pt-4 border-t border-glass-200">
          <div className="flex gap-3">
            {frontmatter.wordCount && <span>✍️ {frontmatter.wordCount} 字</span>}
            {frontmatter.readTime && !isPoetry && <span>📖 {frontmatter.readTime} 分钟</span>}
          </div>
          <span>{formatDate(frontmatter.date)}</span>
        </div>
      </GlassCard>
    </Link>
  );
}

/**
 * 诗歌卡片
 */
function PoetryCard({ writing }: { writing: Content<WritingFrontmatter> }) {
  const { frontmatter, slug } = writing;

  return (
    <Link to={`/writing/${frontmatter.category}/${slug}`} className="block h-full">
      <GlassCard hover className="!pt-8 !px-8 !pb-4 h-full flex flex-col">
        {/* 标签 */}
        {frontmatter.tags && frontmatter.tags.length > 0 && (
          <div className="mb-3 flex gap-2 flex-wrap">
            {frontmatter.tags.map((tag) => (
              <Badge key={tag} variant={frontmatter.statusColor || 'default'}>
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* 标题 */}
        <h3 className="text-xl font-semibold text-text-primary mb-3">
          {frontmatter.title}
        </h3>

        {/* 描述 */}
        <p className="text-text-secondary mb-4 flex-grow line-clamp-none">
          {frontmatter.description}
        </p>

        {/* 底部信息 */}
        <div className="flex items-center justify-end text-sm text-text-secondary pt-4 border-t border-glass-200">
          <span>{formatDate(frontmatter.date)}</span>
        </div>
      </GlassCard>
    </Link>
  );
}

/**
 * 随笔/小说卡片
 */
function DefaultCard({ writing, isPoetry }: { writing: Content<WritingFrontmatter>; isPoetry: boolean }) {
  const { frontmatter, slug } = writing;

  return (
    <Link to={`/writing/${frontmatter.category}/${slug}`} className="block h-full">
      <GlassCard hover className="!pt-8 !px-8 !pb-4 h-full flex flex-col">
        {/* 标签 */}
        {frontmatter.tags && frontmatter.tags.length > 0 && (
          <div className="mb-3 flex gap-2 flex-wrap">
            {frontmatter.tags.map((tag) => (
              <Badge key={tag} variant={frontmatter.statusColor || 'default'}>
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* 标题 */}
        <h3 className="text-xl font-semibold text-text-primary mb-3">
          {frontmatter.title}
        </h3>

        {/* 描述 */}
        <p className="text-text-secondary mb-4 flex-grow line-clamp-none">
          {frontmatter.description}
        </p>

        {/* 底部信息 */}
        <div className="flex items-center justify-between text-sm text-text-secondary pt-4 border-t border-glass-200">
          <div className="flex gap-3">
            {frontmatter.wordCount && <span>✍️ {frontmatter.wordCount} 字</span>}
            {frontmatter.readTime && !isPoetry && <span>📖 {frontmatter.readTime} 分钟</span>}
          </div>
          <span>{formatDate(frontmatter.date)}</span>
        </div>
      </GlassCard>
    </Link>
  );
}

/**
 * 写作卡片组件
 *
 * 用于展示单篇写作的卡片
 * 显示标题、描述、标签和阅读时间
 *
 * @example
 * ```tsx
 * <WritingCard writing={writingData} />
 * ```
 */
export function WritingCard({ writing }: WritingCardProps) {
  const { frontmatter } = writing;
  const isPoetry = frontmatter.category === 'poetry';
  const isAnnual = frontmatter.category === 'annual';

  // 根据分类返回不同的卡片
  if (isAnnual) {
    return <AnnualCard writing={writing} isPoetry={isPoetry} />;
  }

  if (isPoetry) {
    return <PoetryCard writing={writing} />;
  }

  return <DefaultCard writing={writing} isPoetry={isPoetry} />;
}
