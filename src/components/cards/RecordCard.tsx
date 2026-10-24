import { Link } from 'react-router-dom';
import { GlassCard } from '../ui/GlassCard';
import { Badge } from '../ui/Badge';
import { formatDate } from '@/lib/date';
import { getRecordCover, getRecordName, formatRating } from '@/lib/records';
import { RECORD_CATEGORY_MAP } from '@/lib/types';
import type { Content } from '@/lib/types';
import type { RecordFrontmatter, RecordCategory } from '@/lib/types';

/**
 * RecordCard 组件属性
 */
interface RecordCardProps {
  /** 记录内容 */
  record: Content<RecordFrontmatter>;
}

/**
 * 分类对应的徽章配色
 */
const CATEGORY_VARIANT: Record<RecordCategory, 'primary' | 'pink' | 'blue' | 'green'> = {
  movie: 'pink',
  book: 'blue',
  game: 'green',
  music: 'primary',
};

/**
 * 评分药丸
 */
function RatingPill({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-1 !px-3 !py-1 rounded-full text-sm font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20">
      <svg
        className="w-4 h-4"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.05 2.93c.3-.92 1.6-.92 1.9 0l1.07 3.29a1 1 0 00.95.69h3.46c.97 0 1.37 1.24.59 1.81l-2.8 2.03a1 1 0 00-.36 1.12l1.07 3.29c.3.92-.76 1.69-1.54 1.12l-2.8-2.03a1 1 0 00-1.18 0l-2.8 2.03c-.78.57-1.84-.2-1.54-1.12l1.07-3.29a1 1 0 00-.36-1.12L2.98 8.72c-.78-.57-.38-1.81.59-1.81h3.46a1 1 0 00.95-.69L9.05 2.93z" />
      </svg>
      {formatRating(rating)}
    </span>
  );
}

/**
 * 记录大卡片组件
 *
 * 一条记录占满一行：左侧封面，右侧标题、分类、创作者、短评与标签
 * 点击后进入该条记录的详情页
 *
 * @example
 * ```tsx
 * <RecordCard record={recordData} />
 * ```
 */
export function RecordCard({ record }: RecordCardProps) {
  const { frontmatter, slug } = record;
  const cover = getRecordCover(frontmatter);
  const creator = getRecordName(frontmatter);
  const categoryLabel = RECORD_CATEGORY_MAP[frontmatter.category] ?? '记录';

  return (
    <Link to={`/records/${slug}`} className="block h-full">
      <GlassCard hover className="h-full flex flex-row gap-6 !px-6 !py-6">
        {/* 封面 */}
        <div className="w-28 h-40 md:w-36 md:h-52 flex-shrink-0 rounded-xl overflow-hidden bg-glass-100 border border-glass-200">
          {cover ? (
            <img
              src={cover}
              alt={frontmatter.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-text-secondary/60 text-sm">
              {categoryLabel}
            </div>
          )}
        </div>

        {/* 内容 */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* 标题行：分类 + 标题 + 评分 */}
          <div className="flex items-start gap-3 mb-2">
            <Badge variant={CATEGORY_VARIANT[frontmatter.category]}>
              {categoryLabel}
            </Badge>
            <h3 className="flex-1 min-w-0 text-2xl font-semibold text-text-primary leading-tight truncate">
              {frontmatter.title}
            </h3>
            {frontmatter.rating !== null &&
              frontmatter.rating !== undefined && (
                <RatingPill rating={frontmatter.rating} />
              )}
          </div>

          {/* 创作者 */}
          {creator && (
            <p className="text-text-secondary text-sm mb-3">{creator}</p>
          )}

          {/* 短评 */}
          {frontmatter.notes && (
            <p className="text-text-secondary mb-4 line-clamp-2 flex-grow">
              {frontmatter.notes}
            </p>
          )}

          {/* 底部：标签 + 日期 */}
          <div className="flex items-end justify-between gap-4 mt-auto pt-4 border-t border-glass-200">
            <div className="flex gap-2 flex-wrap">
              {frontmatter.tags.map((tag) => (
                <Badge key={tag} variant="default">
                  {tag}
                </Badge>
              ))}
            </div>

            <span className="text-sm text-text-secondary whitespace-nowrap">
              {formatDate(frontmatter.date)}
            </span>
          </div>
        </div>
      </GlassCard>
    </Link>
  );
}
