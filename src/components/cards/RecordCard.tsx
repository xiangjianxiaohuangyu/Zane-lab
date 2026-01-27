import { Link } from 'react-router-dom';
import { GlassCard } from '../ui/GlassCard';
import { Badge } from '../ui/Badge';
import type { Content } from '@/lib/types';
import type { RecordFrontmatter } from '@/lib/types';
import { RECORD_CATEGORY_MAP } from '@/lib/types';

/**
 * RecordCard 组件属性
 */
interface RecordCardProps {
  /** 记录内容 */
  record: Content<RecordFrontmatter>;
}

/**
 * 记录卡片组件
 *
 * 用于展示单条记录（电影、书籍、游戏、音乐）的卡片
 * 显示标题、分类、评分、标签等信息
 *
 * @example
 * ```tsx
 * <RecordCard record={recordData} />
 * ```
 */
export function RecordCard({ record }: RecordCardProps) {
  const { frontmatter, slug } = record;
  const categoryLabel = RECORD_CATEGORY_MAP[frontmatter.category];

  // 根据分类获取额外信息
  const getExtraInfo = () => {
    switch (frontmatter.category) {
      case 'book':
        return frontmatter.author;
      case 'movie':
        return frontmatter.director;
      case 'game':
        return frontmatter.developer;
      case 'music':
        return frontmatter.artist;
      default:
        return null;
    }
  };

  const extraInfo = getExtraInfo();

  return (
    <Link
      to={`/records/${frontmatter.category}/${slug}`}
      className="block h-full"
    >
      <GlassCard hover className="h-full flex flex-col">
        {/* 顶部：分类和评分 */}
        <div className="flex items-center justify-between mb-3">
          <Badge variant="primary">{categoryLabel}</Badge>
          {frontmatter.rating && (
            <div className="flex items-center gap-1 text-yellow-400">
              <span>⭐</span>
              <span className="font-medium">{frontmatter.rating}/10</span>
            </div>
          )}
        </div>

        {/* 标题 */}
        <h3 className="text-xl font-semibold text-text-primary mb-1">
          {frontmatter.title}
        </h3>

        {/* 作者/导演/开发商/艺术家 */}
        {extraInfo && (
          <p className="text-text-secondary text-sm mb-3">
            {extraInfo}
          </p>
        )}

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

        {/* 个人感想（如果有） */}
        {frontmatter.notes && (
          <p className="text-text-secondary text-sm mb-4 flex-grow line-clamp-3">
            {frontmatter.notes}
          </p>
        )}

        {/* 日期 */}
        <div className="text-sm text-text-secondary pt-4 border-t border-glass-200">
          {new Date(frontmatter.date).toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </div>
      </GlassCard>
    </Link>
  );
}
