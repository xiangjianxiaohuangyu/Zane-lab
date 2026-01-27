import { useState, useEffect } from 'react';
import { WritingCard } from '../cards/WritingCard';
import { AnimatedWrapper } from '../ui/AnimatedWrapper';
import { CardSkeleton } from '../ui/Skeleton';
import { getContent } from '@/lib/content';
import type { Content } from '@/lib/types';
import type { WritingFrontmatter } from '@/lib/types';
import { WRITING_CATEGORY_MAP } from '@/lib/types';

/**
 * Writing 区块组件
 *
 * 写作分类区块，展示三个写作分类入口
 * 用于写作分类页
 *
 * @example
 * ```tsx
 * <Writing />
 * ```
 */
export function Writing() {
  const [writings, setWritings] = useState<Content<WritingFrontmatter>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getContent().then((data) => {
      setWritings(data.writing);
      setLoading(false);
    });
  }, []);

  const categories = ['essay', 'annual', 'fiction'] as const;

  return (
    <section>
      {/* 加载状态 */}
      {loading ? (
        <div className="space-y-12">
          {categories.map((category) => (
            <div key={category}>
              <h3 className="text-2xl font-semibold text-text-primary mb-6">
                {WRITING_CATEGORY_MAP[category]}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            const categoryWritings = writings.filter(
              (w) => w.frontmatter.category === category
            );
            const categoryLabel = WRITING_CATEGORY_MAP[category];

            return (
              <div key={category}>
                {/* 分类标题 */}
                <h3 className="text-2xl font-semibold text-text-primary mb-6">
                  {categoryLabel}
                </h3>

                {/* 该分类下的写作列表 */}
                {categoryWritings.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryWritings.map((writing, index) => (
                      <AnimatedWrapper
                        key={writing.slug}
                        delay={index * 100}
                        animation="fade-in-up"
                      >
                        <WritingCard writing={writing} />
                      </AnimatedWrapper>
                    ))}
                  </div>
                ) : (
                  // 空状态
                  <div className="text-center py-12 glass-card rounded-2xl">
                    <p className="text-text-secondary text-lg">
                      暂无{categoryLabel}内容
                    </p>
                    <p className="text-text-secondary/60 text-sm mt-2">
                      内容将在添加后自动显示
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
