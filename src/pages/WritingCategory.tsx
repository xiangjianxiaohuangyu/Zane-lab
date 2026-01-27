/**
 * WritingCategory 写作分类页组件
 *
 * 展示单个分类下的所有写作内容
 */

import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { WritingCard } from '../components/cards/WritingCard';
import { AnimatedWrapper } from '../components/ui/AnimatedWrapper';
import { CardSkeleton } from '../components/ui/Skeleton';
import { BackButton } from '../components/ui/BackButton';
import { getContent } from '../lib/content';
import type { Content } from '../lib/types';
import type { WritingFrontmatter } from '../lib/types';
import { WRITING_CATEGORY_MAP } from '../lib/types';

/**
 * WritingCategory 页面组件
 */
export function WritingCategory() {
  const { category } = useParams<{ category: string }>();
  const [writings, setWritings] = useState<Content<WritingFrontmatter>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getContent().then((data) => {
      if (category) {
        const categoryWritings = data.writing.filter(
          (w) => w.frontmatter.category === category
        );
        setWritings(categoryWritings);
      }
      setLoading(false);
    });
  }, [category]);

  const categoryLabel = category ? WRITING_CATEGORY_MAP[category] : '未知分类';

  if (loading) {
    return (
      <div className="py-48">
        <div className="mb-8">
          <BackButton to="/writing" />
        </div>
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-text-primary mb-2">
            {categoryLabel}
          </h1>
          <p className="text-text-secondary text-lg">
            浏览所有{categoryLabel}内容
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="py-48">
      {/* 返回按钮 */}
      <div className="mb-8">
        <BackButton to="/writing" />
      </div>

      {/* 页面标题 */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-text-primary mb-2">
          {categoryLabel}
        </h1>
        <p className="text-text-secondary text-lg">
          共 {writings.length} 篇{categoryLabel}
        </p>
      </div>

      {/* 写作列表 */}
      {writings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {writings.map((writing, index) => (
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
}
