/**
 * RecordDetail 记录详情页组件
 *
 * 展示单条记录的详细信息：
 * 头部为两栏——左侧封面与图集轮播，右侧标题、类别与创作者、评分标签日期、简评；
 * 下方为完整正文
 */

import { useParams } from 'react-router-dom';
import { useState, useEffect, useRef, useCallback } from 'react';
import type { MouseEvent as ReactMouseEvent, KeyboardEvent as ReactKeyboardEvent } from 'react';
import { getRecordBySlug, getContent } from '../lib/content';
import { formatDate } from '../lib/date';
import { getRecordCover, getRecordImages, getRecordName, formatRating } from '../lib/records';
import { MarkdownRenderer } from '../components/ui/MarkdownRenderer';
import { ImageCarousel } from '../components/ui/ImageCarousel';
import { ImageLightbox } from '../components/ui/ImageLightbox';
import { BackButton } from '../components/ui/BackButton';
import { Badge } from '../components/ui/Badge';
import { GlassCard } from '../components/ui/GlassCard';
import { RECORD_CATEGORY_MAP } from '../lib/types';
import type { Content } from '../lib/types';
import type { RecordFrontmatter, RecordCategory } from '../lib/types';

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
 * RecordDetail 页面组件
 */
export function RecordDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [record, setRecord] = useState<Content<RecordFrontmatter> | null>(null);
  const [loading, setLoading] = useState(true);

  // 正文容器，用于事件委托捕获 Markdown 内嵌图的点击
  const bodyRef = useRef<HTMLDivElement>(null);
  const bodyTriggerRef = useRef<HTMLImageElement | null>(null);
  // 正文内嵌图的灯箱状态，-1 表示关闭
  const [bodyImages, setBodyImages] = useState<string[]>([]);
  const [bodyLightboxIndex, setBodyLightboxIndex] = useState(-1);

  // 头部轮播：当前图片索引与灯箱开关，灯箱内翻页会同步轮播
  const headerTriggerRef = useRef<HTMLButtonElement | null>(null);
  const [headerIndex, setHeaderIndex] = useState(0);
  const [headerLightboxOpen, setHeaderLightboxOpen] = useState(false);

  /** 关闭头部灯箱并把焦点还给被点击的图片 */
  const closeHeaderLightbox = useCallback(() => {
    setHeaderLightboxOpen(false);
    headerTriggerRef.current?.focus();
  }, []);

  // 滚动到页面顶部
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // 切换记录时重置轮播位置，避免索引越界
    setHeaderIndex(0);
    setHeaderLightboxOpen(false);
  }, [slug]);

  useEffect(() => {
    getContent().then(() => {
      if (slug) {
        setRecord(getRecordBySlug(slug) || null);
      }
      setLoading(false);
    });
  }, [slug]);

  if (loading) {
    return (
      <div className="py-48">
        <div className="text-center py-12">
          <p className="text-text-secondary text-lg">加载中...</p>
        </div>
      </div>
    );
  }

  if (!record) {
    return (
      <div className="py-48">
        <div className="text-center py-12">
          <p className="text-text-secondary text-lg mb-4">记录未找到</p>
          <BackButton to="/records" />
        </div>
      </div>
    );
  }

  const { frontmatter, content } = record;
  const cover = getRecordCover(frontmatter);
  const galleryImages = getRecordImages(frontmatter);
  const creator = getRecordName(frontmatter);
  const categoryLabel = RECORD_CATEGORY_MAP[frontmatter.category] ?? '记录';
  const hasRating = typeof frontmatter.rating === 'number';
  const hasTags = Array.isArray(frontmatter.tags) && frontmatter.tags.length > 0;

  // 封面只用于列表页缩略图；详情页的轮播与灯箱只放图集（灯箱照片）
  // 没有图集时回退到封面，避免详情页左栏空着
  const headerImages = galleryImages.length > 0 ? galleryImages : cover ? [cover] : [];

  /** 打开头部轮播的灯箱 */
  function openHeaderLightbox(index: number, trigger: HTMLButtonElement) {
    headerTriggerRef.current = trigger;
    setHeaderIndex(index);
    setHeaderLightboxOpen(true);
  }

  /**
   * 打开正文内嵌图的灯箱
   *
   * 索引按 DOM 顺序计算而非比较 src，正文里出现两张相同图片时也能定位正确
   */
  function openBodyLightbox(image: HTMLImageElement) {
    const container = bodyRef.current;
    if (!container) return;

    const images = Array.from(container.querySelectorAll('img'));
    const index = images.indexOf(image);
    if (index === -1) return;

    bodyTriggerRef.current = image;
    setBodyImages(images.map((item) => item.getAttribute('src') ?? ''));
    setBodyLightboxIndex(index);
  }

  /** 关闭正文灯箱并把焦点还给被点击的图片 */
  function closeBodyLightbox() {
    setBodyLightboxIndex(-1);
    bodyTriggerRef.current?.focus();
  }

  /** 正文点击事件委托：只响应图片点击 */
  function handleBodyClick(event: ReactMouseEvent<HTMLDivElement>) {
    const target = event.target as HTMLElement;
    if (target.tagName !== 'IMG') return;

    openBodyLightbox(target as HTMLImageElement);
  }

  /** 图片不是按钮，不会自动响应 Enter / Space，需要手动触发 */
  function handleBodyKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (event.key !== 'Enter' && event.key !== ' ') return;

    const target = event.target as HTMLElement;
    if (target.tagName !== 'IMG') return;

    event.preventDefault();
    openBodyLightbox(target as HTMLImageElement);
  }

  return (
    <div className="py-48">
      {/* 返回按钮 */}
      <div className="mb-8">
        <BackButton to="/records" />
      </div>

      {/* 记录头部信息 */}
      <div className="mb-6">
        {/* hover={false}：卡片本身不可点击，且内部有可点击的图片按钮，
            卡片级的 pointer 光标与 scale(1.02) 会与之冲突 */}
        <GlassCard className="!pt-8 !px-10 !pb-8" hover={false}>
          <div className="flex flex-col md:flex-row gap-8">
            {/* 左侧：图集轮播（无图集时回退为封面） */}
            <div className="w-full md:w-48 flex-shrink-0">
              {headerImages.length > 0 && (
                <ImageCarousel
                  images={headerImages}
                  index={headerIndex}
                  onIndexChange={setHeaderIndex}
                  onOpen={openHeaderLightbox}
                  autoPlay={!headerLightboxOpen}
                />
              )}
            </div>

            {/* 右侧：文字内容 */}
            <div className="flex-1 min-w-0">
              {/* 标题 */}
              <h1 className="text-4xl md:text-5xl font-bold text-text-primary leading-tight">
                {frontmatter.title}
              </h1>

              {/* 类别与创作者 */}
              <div className="flex flex-wrap items-center gap-3 mt-4">
                <Badge variant={CATEGORY_VARIANT[frontmatter.category]}>
                  {categoryLabel}
                </Badge>

                {creator && (
                  <span className="text-xl text-text-secondary/80">{creator}</span>
                )}
              </div>

              {/* 评分、标签、日期 */}
              <div className="flex flex-wrap items-center gap-4 mt-4">
                {/* 评分 */}
                {hasRating && (
                  <span className="inline-flex items-center gap-1 !px-3 !py-1 rounded-full text-sm font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.05 2.93c.3-.92 1.6-.92 1.9 0l1.07 3.29a1 1 0 00.95.69h3.46c.97 0 1.37 1.24.59 1.81l-2.8 2.03a1 1 0 00-.36 1.12l1.07 3.29c.3.92-.76 1.69-1.54 1.12l-2.8-2.03a1 1 0 00-1.18 0l-2.8 2.03c-.78.57-1.84-.2-1.54-1.12l1.07-3.29a1 1 0 00-.36-1.12L2.98 8.72c-.78-.57-.38-1.81.59-1.81h3.46a1 1 0 00.95-.69L9.05 2.93z" />
                    </svg>
                    {formatRating(frontmatter.rating as number)} / 10
                  </span>
                )}

                {/* 标签 */}
                {hasTags &&
                  frontmatter.tags.map((tag) => (
                    <Badge key={tag} variant="default">
                      {tag}
                    </Badge>
                  ))}

                {/* 日期 */}
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-text-secondary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-text-secondary text-sm">
                    {formatDate(frontmatter.date)}
                  </span>
                </div>
              </div>

              {/* 简评 */}
              {frontmatter.notes && (
                <p className="mt-6 pl-4 border-l-2 border-glass-300 text-text-secondary/90 leading-relaxed">
                  {frontmatter.notes}
                </p>
              )}
            </div>
          </div>
        </GlassCard>
      </div>

      {/* 记录正文 */}
      <GlassCard className="!px-10 !pt-4 !pb-8" hover={false}>
        <div ref={bodyRef} onClick={handleBodyClick} onKeyDown={handleBodyKeyDown}>
          <MarkdownRenderer content={content} style="record" />
        </div>
      </GlassCard>

      {/* 头部轮播的灯箱（与轮播共用索引） */}
      {headerLightboxOpen && (
        <ImageLightbox
          images={headerImages}
          index={headerIndex}
          onClose={closeHeaderLightbox}
          onIndexChange={setHeaderIndex}
        />
      )}

      {/* 正文内嵌图的灯箱 */}
      {bodyLightboxIndex >= 0 && (
        <ImageLightbox
          images={bodyImages}
          index={bodyLightboxIndex}
          onClose={closeBodyLightbox}
          onIndexChange={setBodyLightboxIndex}
        />
      )}
    </div>
  );
}
