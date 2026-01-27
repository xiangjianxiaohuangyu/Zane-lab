import { useState, useEffect } from 'react';
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
          {categories.map((category) => (
            <div key={category}>
              <h3 className="text-2xl font-semibold text-text-primary mb-6">
                {RECORD_CATEGORY_MAP[category]}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
              </div>
            </div>
          ))}
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
                <h3 className="text-2xl font-semibold text-text-primary mb-6">
                  {categoryLabel}
                </h3>

                {/* 该分类下的记录列表 */}
                {categoryRecords.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {categoryRecords.map((record, index) => (
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
