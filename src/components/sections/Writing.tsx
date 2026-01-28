import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
            // essay 分类包含 essay 和 poetry
            const categoryWritings = writings.filter((w) =>
              category === 'essay'
                ? (w.frontmatter.category === 'essay' || w.frontmatter.category === 'poetry')
                : w.frontmatter.category === category
            );
            const categoryLabel = WRITING_CATEGORY_MAP[category];

            return (
              <div key={category}>
                {/* 分类标题 */}
                <div className="mb-6">
                  {/* 标题和查看所有链接 */}
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-2xl font-semibold text-text-primary">
                      {categoryLabel}
                      <span className="text-text-secondary text-lg ml-2">({categoryWritings.length})</span>
                    </h3>
                    <Link
                      to={`/writing/${category}`}
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

                {/* 该分类下的写作列表 */}
                {categoryWritings.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryWritings.slice(0, 3).map((writing, index) => (
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
