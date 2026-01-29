import { Link } from 'react-router-dom';
import { GlassCard } from '../ui/GlassCard';
import { Badge } from '../ui/Badge';
import type { Content } from '@/lib/types';
import type { RecordFrontmatter } from '@/lib/types';

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
 * 纵向布局卡片（记录主页）
 *
 * 用于网格布局，所有元素居中对齐
 */
function VerticalCard({ record, imagePath, extraInfo }: {
  record: Content<RecordFrontmatter>;
  imagePath: string | null;
  extraInfo: string | null;
}) {
  const { frontmatter } = record;

  return (
    <Link
      to={`/records/${frontmatter.category}`}
      className="block h-full"
    >
      <GlassCard hover className="h-full flex md:flex-col">
        {/* 移动端：只显示作品标题 */}
        <div className="flex-1 flex items-center justify-center p-4 md:hidden">
          <h3 className="text-lg font-semibold text-text-primary text-center">
            {frontmatter.title}
          </h3>
        </div>

        {/* 桌面端：保持原有纵向布局 */}
        <div className="hidden md:flex flex-col flex-grow">
          {/* 图片区域 */}
          {imagePath && (
            <div className="w-full h-64">
              <img
                src={imagePath}
                alt={frontmatter.title}
                className="w-full h-full object-contain"
                loading="lazy"
              />
            </div>
          )}

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
            <p className="text-text-secondary text-sm mb-4 flex-grow line-clamp-3">
              {frontmatter.notes}
            </p>
          )}

          {/* 日期 - 固定在底部 */}
          <div className="text-sm text-text-secondary text-center mt-auto pt-4 border-t border-glass-200">
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

/**
 * 横向布局卡片（电影详情页）
 *
 * 用于单列布局，左侧图片，右侧内容，日期在右下角
 */
function HorizontalCard({ record, imagePath, extraInfo }: {
  record: Content<RecordFrontmatter>;
  imagePath: string | null;
  extraInfo: string | null;
}) {
  const { frontmatter } = record;

  return (
    <Link
      to={`/records/${frontmatter.category}`}
      className="block h-full"
    >
      <GlassCard hover className="h-full flex flex-row gap-6">
        {/* 图片区域 */}
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
          {/* 标题、导演和标签 */}
          <div className="flex flex-col items-center gap-2 md:gap-4 md:flex-row md:items-center mb-4">
            {/* 标题 */}
            <h3 className="text-2xl md:text-3xl font-semibold text-text-primary text-center md:text-left">
              {frontmatter.title}
            </h3>

            {/* 作者/导演/开发商/艺术家 */}
            {extraInfo && (
              <p className="text-text-secondary text-sm truncate text-center md:text-left">
                {extraInfo}
              </p>
            )}

            {/* 标签 */}
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

          {/* 个人感想（如果有） */}
          {frontmatter.notes && (
            <p className="text-text-secondary text-sm md:text-base indent-4 md:indent-8 flex-grow">
              {frontmatter.notes}
            </p>
          )}

          {/* 日期 - 固定在底部右侧 */}
          <div className="text-sm text-text-secondary text-right mt-auto">
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
  const extraInfo = (() => {
    switch (frontmatter.category) {
      case 'book':
        return frontmatter.author ?? null;
      case 'movie':
        return frontmatter.director ?? null;
      case 'game':
        return frontmatter.developer ?? null;
      case 'music':
        return frontmatter.artist ?? null;
      default:
        return null;
    }
  })();

  // 根据 variant 返回对应的组件
  if (variant === 'horizontal') {
    return <HorizontalCard record={record} imagePath={imagePath} extraInfo={extraInfo} />;
  }

  return <VerticalCard record={record} imagePath={imagePath} extraInfo={extraInfo} />;
}
