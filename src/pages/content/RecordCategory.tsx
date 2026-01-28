/**
 * RecordCategory 记录分类详情页组件
 *
 * 展示某个分类（电影/书籍/游戏/音乐）的所有记录
 * 每张卡片占据一行，使用横向布局
 * 电影分类额外显示影史十佳区域
 */

import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getContent, getTop10Movies } from '@/lib/content';
import { RecordCard } from '../../components/cards/RecordCard';
import { Top10MovieCard } from '../../components/cards/Top10MovieCard';
import { Collapsible } from '../../components/ui/Collapsible';
import { AnimatedWrapper } from '../../components/ui/AnimatedWrapper';
import { CardSkeleton } from '../../components/ui/Skeleton';
import { BackButton } from '../../components/ui/BackButton';
import { RECORD_CATEGORY_MAP } from '@/lib/types';
import type { Content } from '@/lib/types';
import type { RecordFrontmatter, Top10MovieEntry } from '@/lib/types';

/**
 * RecordCategory 页面组件
 */
export function RecordCategory() {
  const { category } = useParams<{ category: string }>();
  const [records, setRecords] = useState<Content<RecordFrontmatter>[]>([]);
  const [top10Movies, setTop10Movies] = useState<Top10MovieEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // 滚动到页面顶部
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [category]);

  useEffect(() => {
    const loadData = async () => {
      const data = await getContent();

      if (category) {
        const categoryRecords = data.records.filter(
          (r) => r.frontmatter.category === category
        );
        setRecords(categoryRecords);

        // 如果是电影分类，额外加载影史十佳
        if (category === 'movie') {
          const top10 = await getTop10Movies();
          setTop10Movies(top10);
        }
      }

      setLoading(false);
    };

    loadData();
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
        <div className="flex items-center gap-4 mb-2">
          <h1 className="text-4xl font-bold text-text-primary">
            {categoryLabel}
          </h1>
          {category === 'movie' && (
            <a
              href="https://movie.douban.com/people/227180810/?_i=9593368QjA0V5ostatus=collect"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-glass-300 backdrop-blur-md border border-glass-100 rounded-full text-sm text-text-primary hover:bg-glass-400 transition-all duration-200"
            >
              查看全部电影（983）
            </a>
          )}
          {category === 'book' && (
            <a
              href="https://book.douban.com/people/227180810/?_i=9593368QjA0V5ostatus=collect"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-glass-300 backdrop-blur-md border border-glass-100 rounded-full text-sm text-text-primary hover:bg-glass-400 transition-all duration-200"
            >
              查看全部书籍
            </a>
          )}
          {category === 'game' && (
            <a
              href="https://www.douban.com/people/227180810/games?action=collect"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-glass-300 backdrop-blur-md border border-glass-100 rounded-full text-sm text-text-primary hover:bg-glass-400 transition-all duration-200"
            >
              查看全部游戏（103）
            </a>
          )}
        </div>
        <p className="text-text-secondary text-lg">
          共 {records.length} 部{categoryLabel}
        </p>
      </div>

      {/* 影史十佳区域 - 仅在电影分类显示 */}
      {category === 'movie' && top10Movies.length > 0 && (
        <div className="mb-12">
          <Collapsible title="心目中的影史十佳" defaultExpanded={true}>
            <div className="space-y-6">
              {top10Movies.map((entry) => (
                <AnimatedWrapper
                  key={entry.movie.slug}
                  delay={entry.num * 50}
                  animation="fade-in-up"
                >
                  <Top10MovieCard entry={entry} />
                </AnimatedWrapper>
              ))}
            </div>
          </Collapsible>
        </div>
      )}

      {/* 全部区域 */}
      <div>
        <h2 className="text-2xl font-bold mb-6 text-text-primary">
          喜爱的{categoryLabel}
        </h2>
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
    </div>
  );
}
