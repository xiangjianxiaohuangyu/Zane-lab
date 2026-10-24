import { useState, useEffect } from 'react';
import { RecordCard } from '../cards/RecordCard';
import { AnimatedWrapper } from '../ui/AnimatedWrapper';
import { ListSkeleton } from '../ui/Skeleton';
import { getContent } from '@/lib/content';
import { RECORD_CATEGORY_MAP } from '@/lib/types';
import type { Content } from '@/lib/types';
import type { RecordFrontmatter } from '@/lib/types';

/**
 * 可筛选的分类
 *
 * 按展示顺序排列，activeClass 为该分类被选中时的高亮配色
 */
const FILTERS = [
  {
    category: 'movie',
    activeClass: 'bg-pink-500/20 text-pink-300 border-pink-500/40',
  },
  {
    category: 'book',
    activeClass: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
  },
  {
    category: 'game',
    activeClass: 'bg-green-500/20 text-green-400 border-green-500/40',
  },
] as const;

type FilterCategory = (typeof FILTERS)[number]['category'];

/**
 * Records 区块组件
 *
 * 记录列表区块，一条记录一张大卡片，按时间倒序排列（最新的在最前面）
 * 支持按电影 / 书籍 / 游戏多选叠加筛选
 *
 * @example
 * ```tsx
 * <Records />
 * ```
 */
export function Records() {
  const [records, setRecords] = useState<Content<RecordFrontmatter>[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterCategory[]>([]);

  useEffect(() => {
    getContent()
      .then((data) => {
        setRecords(data.records);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Failed to load records:', error);
        setLoading(false);
      });
  }, []);

  // 统计每个分类的条数，只有存在的分类才展示筛选按钮
  const counts = records.reduce<Partial<Record<FilterCategory, number>>>(
    (acc, record) => {
      const { category } = record.frontmatter;
      acc[category as FilterCategory] =
        (acc[category as FilterCategory] ?? 0) + 1;
      return acc;
    },
    {}
  );
  const availableFilters = FILTERS.filter(({ category }) =>
    (counts[category] ?? 0) > 0
  );

  // 未选中任何分类时展示全部
  const visible = records.filter(
    (record) =>
      filters.length === 0 ||
      filters.includes(record.frontmatter.category as FilterCategory)
  );

  function toggleFilter(category: FilterCategory) {
    setFilters((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  }

  return (
    <section>
      {/* 筛选按钮 - 多选可叠加 */}
      {availableFilters.length > 1 && (
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <button
            type="button"
            onClick={() => setFilters([])}
            className={`px-4 py-2 rounded-full text-sm border backdrop-blur-md transition-all duration-200 ${
              filters.length === 0
                ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                : 'bg-glass-300 text-text-secondary border-glass-100 hover:bg-glass-400'
            }`}
          >
            全部 {records.length}
          </button>
          {availableFilters.map(({ category, activeClass }) => {
            const active = filters.includes(category);
            return (
              <button
                key={category}
                type="button"
                onClick={() => toggleFilter(category)}
                className={`px-4 py-2 rounded-full text-sm border backdrop-blur-md transition-all duration-200 ${
                  active
                    ? activeClass
                    : 'bg-glass-300 text-text-secondary border-glass-100 hover:bg-glass-400'
                }`}
              >
                {RECORD_CATEGORY_MAP[category]} {counts[category]}
              </button>
            );
          })}
        </div>
      )}

      {/* 加载状态 */}
      {loading ? (
        <ListSkeleton />
      ) : visible.length > 0 ? (
        // 记录列表 - 一条记录一张大卡片
        <div className="space-y-6">
          {visible.map((record, index) => (
            <AnimatedWrapper
              key={record.slug}
              delay={index * 100}
              animation="fade-in-up"
            >
              <RecordCard record={record} />
            </AnimatedWrapper>
          ))}
        </div>
      ) : (
        // 空状态
        <div className="text-center py-12">
          <p className="text-text-secondary text-lg">
            暂无记录
          </p>
          <p className="text-text-secondary/60 text-sm mt-2">
            记录将在添加后自动显示
          </p>
        </div>
      )}
    </section>
  );
}