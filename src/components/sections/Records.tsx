import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { RecordCard } from '../cards/RecordCard';
import { AnimatedWrapper } from '../ui/AnimatedWrapper';
import { CardSkeleton } from '../ui/Skeleton';
import { getContent } from '@/lib/content';
import type { Content } from '@/lib/types';
import type { RecordFrontmatter } from '@/lib/types';
import { RECORD_CATEGORY_MAP } from '@/lib/types';

/**
 * Records 区块组件
 *
 * 记录分类区块，展示四个记录分类入口
 * 用于记录分类页
 *
 * @example
 * ```tsx
 * <Records />
 * ```
 */
export function Records() {
  const [records, setRecords] = useState<Content<RecordFrontmatter>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getContent().then((data) => {
      setRecords(data.records);
      setLoading(false);
    });
  }, []);

  const categories = ['movie', 'book', 'game', 'music'] as const;

  return (
    <section>
      {/* 加载状态 */}
      {loading ? (
        <div className="space-y-12">
          {categories.map((category) => {
            const categoryLabel = RECORD_CATEGORY_MAP[category];
            return (
              <div key={category}>
                {/* 分类标题 */}
                <div className="mb-6">
                  {/* 标题和查看所有链接 */}
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-2xl font-semibold text-text-primary">
                      {categoryLabel}
                    </h3>
                    <Link
                      to={`/records/${category}`}
                      className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-primary transition-all duration-200 group"
                    >
                      <span>查看所有</span>
                      <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>

                  {/* 分隔线 */}
                  <div className="border-b border-glass-200 mb-6"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  <CardSkeleton />
                  <CardSkeleton />
                  <CardSkeleton />
                  <CardSkeleton />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        // 分类网格
        <div className="space-y-12">
          {categories.map((category) => {
            const categoryRecords = records.filter(
              (r) => r.frontmatter.category === category
            );
            const categoryLabel = RECORD_CATEGORY_MAP[category];

            return (
              <div key={category}>
                {/* 分类标题 */}
                <div className="mb-6">
                  {/* 标题和查看所有链接 */}
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-2xl font-semibold text-text-primary">
                      {categoryLabel}
                      <span className="text-text-secondary text-lg ml-2">({categoryRecords.length})</span>
                    </h3>
                    <Link
                      to={`/records/${category}`}
                      className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-primary transition-all duration-200 group"
                    >
                      <span>查看所有</span>
                      <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>

                  {/* 分隔线 */}
                  <div className="border-b border-glass-200 mb-6"></div>
                </div>

                {/* 该分类下的记录列表 */}
                {categoryRecords.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {categoryRecords.slice(0, 4).map((record, index) => (
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
                  <div className="text-center py-12 glass-card rounded-2xl">
                    <p className="text-text-secondary text-lg">
                      暂无{categoryLabel}记录
                    </p>
                    <p className="text-text-secondary/60 text-sm mt-2">
                      记录将在添加后自动显示
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
