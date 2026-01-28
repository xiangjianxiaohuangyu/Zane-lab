/**
 * RecordCategory 记录分类详情页组件
 *
 * 展示某个分类（电影/书籍/游戏/音乐）的所有记录
 * 每张卡片占据一行，使用横向布局
 */

import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getContent } from '@/lib/content';
import { RecordCard } from '../../components/cards/RecordCard';
import { AnimatedWrapper } from '../../components/ui/AnimatedWrapper';
import { CardSkeleton } from '../../components/ui/Skeleton';
import { BackButton } from '../../components/ui/BackButton';
import { RECORD_CATEGORY_MAP } from '@/lib/types';
import type { Content } from '@/lib/types';
import type { RecordFrontmatter } from '@/lib/types';

/**
 * RecordCategory 页面组件
 */
export function RecordCategory() {
  const { category } = useParams<{ category: string }>();
  const [records, setRecords] = useState<Content<RecordFrontmatter>[]>([]);
  const [loading, setLoading] = useState(true);

  // 滚动到页面顶部
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [category]);

  useEffect(() => {
    getContent().then((data) => {
      if (category) {
        const categoryRecords = data.records.filter(
          (r) => r.frontmatter.category === category
        );
        setRecords(categoryRecords);
      }
      setLoading(false);
    });
  }, [category]);

  if (loading) {
    return (
      <div className="py-48">
        <div className="mb-8">
          <BackButton to="/records" />
        </div>
        <div className="space-y-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    );
  }

  const categoryLabel = category ? RECORD_CATEGORY_MAP[category] : '未知分类';

  if (records.length === 0) {
    return (
      <div className="py-48">
        <div className="mb-8">
          <BackButton to="/records" />
        </div>
        <div className="text-center py-12 glass-card rounded-2xl">
          <p className="text-text-secondary text-lg">
            暂无{categoryLabel}记录
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-48">
      {/* 返回按钮 */}
      <div className="mb-8">
        <BackButton to="/records" />
      </div>

      {/* 页面标题 */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-text-primary mb-2">
          {categoryLabel}
        </h1>
        <p className="text-text-secondary text-lg">
          共 {records.length} 部{categoryLabel}
        </p>
      </div>

      {/* 记录列表 - 每行一个卡片 */}
      <div className="space-y-6">
        {records.map((record, index) => (
          <AnimatedWrapper
            key={record.slug}
            delay={index * 50}
            animation="fade-in-up"
          >
            <RecordCard record={record} variant="horizontal" />
          </AnimatedWrapper>
        ))}
      </div>
    </div>
  );
}
