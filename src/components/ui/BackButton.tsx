import { Link } from 'react-router-dom';

/**
 * BackButton 返回按钮组件
 *
 * 液态玻璃效果的返回按钮，用于返回上一页
 * 特点：
 * - 药丸型外观（全圆角）
 * - 液态玻璃效果（毛玻璃 + 半透明）
 * - 悬停动画
 * - 可自定义位置（默认左上角）
 *
 * @example
 * ```tsx
 * <BackButton />
 * <BackButton to="/custom-path" />
 * ```
 */
export function BackButton({ to = '/', className = '' }: { to?: string; className?: string }) {
  return (
    <Link
      to={to}
      className={`
        inline-flex
        items-center
        gap-0
        px-4
        py-2
        rounded-full
        text-sm
        font-medium
        text-text-secondary
        transition-all
        duration-300
        glass-card
        hover:text-text-primary
        hover:bg-glass-200
        hover:scale-105
        ${className}
      `}
    >
      {/* 返回箭头图标 */}
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="8 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 19l-7-7 7-7"
        />
      </svg>

      {/* 返回文字 */}
      <span>返回</span>
    </Link>
  );
}
