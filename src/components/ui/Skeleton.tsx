/**
 * 卡片骨架屏组件
 *
 * 玻璃拟态风格的加载占位符
 * 显示脉冲动画，提升加载体验
 *
 * @example
 * ```tsx
 * {loading ? (
 *   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 *     <CardSkeleton />
 *     <CardSkeleton />
 *   </div>
 * ) : (
 *   <ActualContent />
 * )}
 * ```
 */
export function CardSkeleton() {
  return (
    <div className="glass-card !p-8 rounded-2xl border border-glass-200">
      {/* 标题骨架 */}
      <div className="h-6 bg-glass-200 rounded skeleton-pulse mb-4 w-3/4"></div>

      {/* 描述骨架 */}
      <div className="space-y-2 mb-8">
        <div className="h-4 bg-glass-200 rounded skeleton-pulse"></div>
        <div className="h-4 bg-glass-200 rounded skeleton-pulse w-5/6"></div>
        <div className="h-4 bg-glass-200 rounded skeleton-pulse w-4/6"></div>
      </div>

      {/* 标签骨架 */}
      <div className="flex gap-2 mb-4">
        <div className="h-6 w-16 bg-glass-200 rounded-full skeleton-pulse"></div>
        <div className="h-6 w-20 bg-glass-200 rounded-full skeleton-pulse"></div>
        <div className="h-6 w-16 bg-glass-200 rounded-full skeleton-pulse"></div>
      </div>

      {/* 底部骨架 */}
      <div className="pt-4 border-t border-glass-200">
        <div className="h-4 bg-glass-200 rounded skeleton-pulse w-1/3"></div>
      </div>
    </div>
  );
}

/**
 * 列表骨架屏组件
 *
 * 用于写作和记录页面的列表加载占位
 */
export function ListSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <div
          key={item}
          className="glass-card !p-6 rounded-2xl border border-glass-200"
        >
          <div className="h-5 bg-glass-200 rounded skeleton-pulse mb-3 w-2/3"></div>
          <div className="h-4 bg-glass-200 rounded skeleton-pulse mb-2"></div>
          <div className="h-4 bg-glass-200 rounded skeleton-pulse w-4/5"></div>
        </div>
      ))}
    </div>
  );
}
