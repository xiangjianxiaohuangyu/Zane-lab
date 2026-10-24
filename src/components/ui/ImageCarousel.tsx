/**
 * ImageCarousel 图片轮播组件
 *
 * 一次只显示一张图片，不露出相邻图片，下方用灰色小点标明当前是第几张。
 * 每 3 秒自动切到下一张，末尾回到第一张；小点可点击直接跳转。
 * 索引由调用方持有，因此灯箱内翻页时轮播也会同步到同一张。
 */

import { useEffect, useRef } from 'react';
import { deriveImageAlt } from './ImageLightbox';

/** 自动轮播间隔（毫秒） */
const AUTO_PLAY_INTERVAL = 3000;

/** 滚动停止后再同步索引的延迟（毫秒） */
const SCROLL_SYNC_DELAY = 120;

/**
 * ImageCarousel 组件属性
 */
interface ImageCarouselProps {
  /** 图片 URL 列表 */
  images: string[];

  /** 当前展示的图片索引 */
  index: number;

  /** 切换当前展示的图片 */
  onIndexChange: (index: number) => void;

  /** 点击某张图片时的回调：图片索引与触发该次点击的按钮 */
  onOpen: (index: number, trigger: HTMLButtonElement) => void;

  /** 是否自动轮播（灯箱打开时应暂停） */
  autoPlay?: boolean;

  /** 自定义类名（可选） */
  className?: string;
}

/**
 * ImageCarousel 组件
 *
 * @example
 * ```tsx
 * <ImageCarousel
 *   images={['/images/records/a.webp']}
 *   index={0}
 *   onIndexChange={setIndex}
 *   onOpen={(i, btn) => openLightbox(i, btn)}
 * />
 * ```
 */
export function ImageCarousel({
  images,
  index,
  onIndexChange,
  onOpen,
  autoPlay = true,
  className = '',
}: ImageCarouselProps) {
  // 轨道容器：横向滚动，一次只露出一张
  const trackRef = useRef<HTMLDivElement>(null);
  // 事件回调里读取最新的索引与回调，避免闭包过期
  const indexRef = useRef(index);
  const changeRef = useRef(onIndexChange);
  const syncTimerRef = useRef<number | undefined>(undefined);
  indexRef.current = index;
  changeRef.current = onIndexChange;

  const total = images.length;
  const hasMultiple = total > 1;

  /** 让第 i 张图片贴齐左边缘所需的滚动位置 */
  function leftOffset(i: number): number {
    const track = trackRef.current;
    if (!track) return 0;

    const slide = track.children[i] as HTMLElement | undefined;
    if (!slide) return 0;

    return slide.offsetLeft;
  }

  /** 与左边缘最接近的那张图片 */
  function nearestIndex(): number {
    const track = trackRef.current;
    if (!track) return 0;

    const slides = Array.from(track.children) as HTMLElement[];
    let nearest = 0;
    let minDistance = Infinity;
    slides.forEach((slide, i) => {
      const distance = Math.abs(slide.offsetLeft - track.scrollLeft);
      if (distance < minDistance) {
        minDistance = distance;
        nearest = i;
      }
    });

    return nearest;
  }

  /** 切换到指定索引，首尾循环 */
  function goTo(i: number) {
    changeRef.current(((i % total) + total) % total);
  }

  // 索引变化时把当前图片滚到左边缘（灯箱翻页也会走这里）
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const target = leftOffset(index);
    // 已经到位就不重复触发一次平滑滚动
    if (Math.abs(track.scrollLeft - target) < 2) return;

    track.scrollTo({ left: target, behavior: 'smooth' });
  }, [index, total]);

  // 自动轮播
  useEffect(() => {
    if (!autoPlay || !hasMultiple) return;

    const timer = window.setInterval(() => {
      goTo(indexRef.current + 1);
    }, AUTO_PLAY_INTERVAL);

    return () => window.clearInterval(timer);
  }, [autoPlay, hasMultiple, total]);

  // 卸载时清掉待执行的索引同步
  useEffect(() => () => window.clearTimeout(syncTimerRef.current), []);

  /** 手动滚动结束后，按最接近左边缘的一张同步索引 */
  function handleScroll() {
    window.clearTimeout(syncTimerRef.current);
    syncTimerRef.current = window.setTimeout(() => {
      if (nearestIndex() !== indexRef.current) {
        changeRef.current(nearestIndex());
      }
    }, SCROLL_SYNC_DELAY);
  }

  if (total === 0) return null;

  return (
    <div className={`group relative ${className}`.trim()}>
      {/* 图片轨道：一次只显示一张，不露出相邻图片 */}
      <div
        ref={trackRef}
        onScroll={handleScroll}
        className="relative flex gap-2 overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {images.map((src, i) => (
          <button
            key={`${src}-${i}`}
            type="button"
            onClick={(event) => onOpen(i, event.currentTarget)}
            aria-label={`查看第 ${i + 1} 张图片，共 ${total} 张`}
            aria-current={i === index}
            className="group/slide relative block w-full flex-shrink-0 snap-start overflow-hidden rounded-xl border border-glass-200 bg-glass-100 shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            <img
              src={src}
              alt={deriveImageAlt(src)}
              className="w-full aspect-[3/4] object-cover transition-transform duration-300 group-hover/slide:scale-[1.03]"
            />
          </button>
        ))}
      </div>

      {/* 位置指示点：灰色小点，当前项高亮，可点击跳转 */}
      {hasMultiple && (
        <div className="mt-3 flex items-center justify-center gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`跳转到第 ${i + 1} 张图片`}
              aria-current={i === index}
              className={`rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 ${
                i === index ? 'h-1.5 w-4 bg-white/70' : 'h-1.5 w-1.5 bg-white/25 hover:bg-white/45'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
