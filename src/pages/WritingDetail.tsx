/**
 * WritingDetail 写作详情页组件
 *
 * 展示单篇写作内容的详细信息（随笔、年终总结、小说）
 */

import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getWritingBySlug, getContent } from '../lib/content';
import { MarkdownRenderer } from '../components/ui/MarkdownRenderer';
import { BackButton } from '../components/ui/BackButton';
import { Badge } from '../components/ui/Badge';
import { GlassCard } from '../components/ui/GlassCard';
import type { Content } from '../lib/types';
import type { WritingFrontmatter } from '../lib/types';
import { WRITING_CATEGORY_MAP } from '../lib/types';

/**
 * WritingDetail 页面组件
 */
export function WritingDetail() {
  const { category, slug } = useParams<{ category: string; slug: string }>();
  const [writing, setWriting] = useState<Content<WritingFrontmatter> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getContent().then(() => {
      if (slug) {
        const data = getWritingBySlug(slug);
        // 验证分类是否匹配
        if (data && data.frontmatter.category === category) {
          setWriting(data);
        } else {
          setWriting(null);
        }
      }
      setLoading(false);
    });
  }, [slug, category]);

  if (loading) {
    return (
      <div className="py-48">
        <div className="text-center py-12">
          <p className="text-text-secondary text-lg">加载中...</p>
        </div>
      </div>
    );
  }

  if (!writing) {
    return (
      <div className="py-48">
        <div className="text-center py-12">
          <p className="text-text-secondary text-lg mb-4">文章未找到</p>
          <BackButton to="/writing" />
        </div>
      </div>
    );
  }

  const { frontmatter, content } = writing;
  const categoryName = WRITING_CATEGORY_MAP[frontmatter.category] || frontmatter.category;

  return (
    <div className="py-48">
      {/* 返回按钮 */}
      <div className="mb-8">
        <BackButton to="/writing" />
      </div>

      {/* 文章头部信息 */}
      <div className="mb-6">
        <GlassCard className="!pt-6 !px-10 !pb-8">
          {/* 分类标签 */}
          <div className="mb-4">
            <span className="inline-block px-4 py-2 rounded-full text-sm font-medium text-primary bg-glass-100">
              {categoryName}
            </span>
          </div>

          {/* 文章标题 */}
          <h1 className="text-5xl font-bold text-text-primary mb-4">
            {frontmatter.title}
          </h1>

          {/* 文章简介
          {frontmatter.description && (
            <p className="text-xl text-text-secondary mb-6">
              {frontmatter.description}
            </p>
          )} */}

          {/* 元数据 */}
          <div className="flex flex-wrap items-center gap-4 mb-4">
            {/* 发布日期 */}
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-text-secondary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="text-text-secondary text-sm">
                {new Date(frontmatter.date).toLocaleDateString('zh-CN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>

            {/* 阅读时长 */}
            {frontmatter.readTime && (
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-text-secondary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-text-secondary text-sm">
                  阅读时长约 {frontmatter.readTime} 分钟
                </span>
              </div>
            )}
          </div>

          {/* 标签 */}
          {frontmatter.tags && frontmatter.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {frontmatter.tags.map((tag) => (
                <Badge key={tag} variant="default">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </GlassCard>
      </div>

      {/* 文章内容 */}
      <GlassCard className="!px-10 !pt-4 !pb-8" hover={false}>
        <MarkdownRenderer content={content} />
      </GlassCard>
    </div>
  );
}
