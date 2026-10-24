/**
 * ImageLightbox 图片查看器组件
 *
 * 通用的全屏图片预览浮层，不包含任何业务语义。
 *
 * 必须通过 createPortal 挂载到 document.body：
 * .glass-card 的 backdrop-filter 与 .page-transition 的 transform 动画
 * 都会为 position: fixed 的后代创建包含块，导致浮层相对祖先定位而非视口。
 */

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import type { MouseEvent as ReactMouseEvent } from 'react';

/**
 * ImageLightbox 组件属性
 */
interface ImageLightboxProps {
  /** 要展示的图片 URL 列表 */
  images: string[];

  /** 当前显示的图片索引（-1 表示关闭） */
  index: number;

  /** 关闭回调 */
  onClose: () => void;

  /** 切换到指定索引的回调 */
  onIndexChange: (index: number) => void;

  /** 自定义类名（可选） */
  className?: string;
}

/**
 * 从图片 URL 反推可读的文件名，作为 alt 文本
 *
 * @param url - 图片 URL
 * @returns 不含扩展名的文件名
 */
export function deriveImageAlt(url: string): string {
  const filename = url.split('/').pop() ?? '';
  return filename.replace(/\.[^.]+$/, '');
}

/**
 * ImageLightbox 组件
 *
 * 受控组件：index 由父组件持有，-1 表示关闭。
 *
 * @example
 * ```tsx
 * <ImageLightbox
 *   images={images}
 *   index={index}
 *   onClose={() => setIndex(-1)}
 *   onIndexChange={setIndex}
 * />
 * ```
 */
export function ImageLightbox({
  images,
  index,
  onClose,
  onIndexChange,
  className = '',
}: ImageLightboxProps) {
  const isOpen = index >= 0 && index < images.length;
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 打开时把焦点移到关闭按钮，键盘用户按 Enter 即可关闭
  useEffect(() => {
    if (!isOpen) return;
    closeButtonRef.current?.focus();
  }, [isOpen]);

  // 锁定背景滚动，关闭后恢复原值
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  // 键盘导航：Esc 关闭、左右切换、Tab 焦点循环
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        onIndexChange((index - 1 + images.length) % images.length);
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        onIndexChange((index + 1) % images.length);
      } else if (event.key === 'Tab') {
        trapFocus(event);
      }
    }

    /** 轻量焦点陷阱，避免 Tab 跑到背景内容上 */
    function trapFocus(event: KeyboardEvent) {
      const container = containerRef.current;
      if (!container) return;

      const focusable = Array.from(
        container.querySelectorAll<HTMLElement>('button:not([disabled])')
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey) {
        if (active === first || !container.contains(active)) {
          event.preventDefault();
          last.focus();
        }
      } else if (active === last || !container.contains(active)) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, index, images.length, onClose, onIndexChange]);

  if (!isOpen) return null;

  /** 点击遮罩空白处关闭，点击图片本身不关闭 */
  function handleBackdropClick(event: ReactMouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) onClose();
  }

  const hasMultiple = images.length > 1;

  return createPortal(
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-label="图片查看器"
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm animate-fade-in ${className}`.trim()}
      onClick={handleBackdropClick}
    >
      {/* 关闭按钮 */}
      <button
        ref={closeButtonRef}
        type="button"
        onClick={onClose}
        aria-label="关闭图片查看器"
        className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-glass-200 border border-glass-300 text-text-primary transition-colors hover:bg-glass-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* 序号指示 */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-glass-200 border border-glass-300 text-sm text-text-secondary">
        {index + 1} / {images.length}
      </div>

      {/* 上一张 */}
      {hasMultiple && (
        <button
          type="button"
          onClick={() => onIndexChange((index - 1 + images.length) % images.length)}
          aria-label="上一张"
          className="absolute left-2 md:left-8 z-10 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-glass-200 border border-glass-300 text-text-primary transition-colors hover:bg-glass-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* 当前图 */}
      <img
        src={images[index]}
        alt={deriveImageAlt(images[index])}
        className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
      />

      {/* 下一张 */}
      {hasMultiple && (
        <button
          type="button"
          onClick={() => onIndexChange((index + 1) % images.length)}
          aria-label="下一张"
          className="absolute right-2 md:right-8 z-10 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-glass-200 border border-glass-300 text-text-primary transition-colors hover:bg-glass-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </div>,
    document.body
  );
}
