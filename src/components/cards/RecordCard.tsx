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
  /** 布局变体 */
  variant?: 'vertical' | 'horizontal';
}

/**
 * 记录卡片组件
 *
 * 用于展示单条记录（电影、书籍、游戏、音乐）的卡片
 * 支持纵向和横向两种布局模式
 *
 * @example
 * ```tsx
 * // 纵向布局（列表页）
 * <RecordCard record={recordData} variant="vertical" />
 *
 * // 横向布局（详情页）
 * <RecordCard record={recordData} variant="horizontal" />
 * ```
 */
export function RecordCard({ record, variant = 'vertical' }: RecordCardProps) {
  const { frontmatter } = record;
  const categoryLabel = RECORD_CATEGORY_MAP[frontmatter.category];
  const isHorizontal = variant === 'horizontal';

  // 分类到目录名的映射（单数 -> 复数）
  const categoryDirMap: Record<string, string> = {
    movie: 'movies',
    book: 'books',
    game: 'games',
    music: 'music',
  };

  const categoryDir = categoryDirMap[frontmatter.category] || frontmatter.category;

  // 构建图片路径
  const imagePath = frontmatter.cover
    ? `/images/records/${categoryDir}/${frontmatter.cover}`
    : null;

  // 调试日志
  if (frontmatter.cover) {
    console.log(`[RecordCard] ${frontmatter.title} cover:`, frontmatter.cover);
    console.log(`[RecordCard] Image path:`, imagePath);
  } else {
    console.log(`[RecordCard] ${frontmatter.title} has no cover`);
  }

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
      to={`/records/${frontmatter.category}`}
      className="block h-full"
    >
      <GlassCard
        hover
        className={`h-full flex ${isHorizontal ? 'flex-row gap-6' : 'flex-col'}`}
      >
        {/* 图片区域 */}
        {imagePath && (
          <div className={isHorizontal 
                          ? "w-48 h-64 flex-shrink-0"  // 横向布局：固定宽度
                          : "w-full h-64"               // 纵向布局：固定高度
                        }>
            <img
              src={imagePath}
              alt={frontmatter.title}
              className="w-full h-full object-contain"
              loading="lazy"
            />
          </div>
        )}

        {/* 内容区域 */}
        <div className={`flex flex-col ${isHorizontal ? 'flex-1 justify-center' : 'flex-grow'}`}>
          {/* 标题 */}
          <h3 className="text-xl font-semibold text-text-primary mt-2 mb-1 text-center truncate">
            {frontmatter.title}
          </h3>

          {/* 作者/导演/开发商/艺术家 */}
          {extraInfo && (
            <p className="text-text-secondary text-sm mb-3 text-center">
              {extraInfo}
            </p>
          )}

          {/* 标签 */}
          {frontmatter.tags && frontmatter.tags.length > 0 && (
            <div className="flex gap-2 flex-wrap mb-4 justify-center">
              {frontmatter.tags.map((tag) => (
                <Badge key={tag} variant="default">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* 个人感想（如果有） */}
          {frontmatter.notes && (
            <p
              className={`text-text-secondary text-sm ${
                isHorizontal
                  ? 'line-clamp-2'
                  : 'mb-4 flex-grow line-clamp-3'
              }`}
            >
              {frontmatter.notes}
            </p>
          )}

          {/* 日期 - 固定在底部 */}
          <div
            className={`text-sm text-text-secondary ${
              isHorizontal ? '' : 'mt-auto pt-4 border-t border-glass-200'
            }`}
          >
            {new Date(frontmatter.date).toLocaleDateString('zh-CN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
        </div>
      </GlassCard>
    </Link>
  );
}
