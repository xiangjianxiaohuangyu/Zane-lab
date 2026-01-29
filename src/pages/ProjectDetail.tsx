/**
 * ProjectDetail 项目详情页组件
 *
 * 展示单个项目的详细信息
 */

import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getProjectBySlug, getContent } from '../lib/content';
import { MarkdownRenderer } from '../components/ui/MarkdownRenderer';
import { BackButton } from '../components/ui/BackButton';
import { Badge } from '../components/ui/Badge';
import { GlassCard } from '../components/ui/GlassCard';
import type { Content } from '../lib/types';
import type { ProjectFrontmatter } from '../lib/types';
import { PROJECT_STATUS_MAP } from '../lib/types';

/**
 * ProjectDetail 页面组件
 */
export function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<Content<ProjectFrontmatter> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getContent().then(() => {
      if (slug) {
        const data = getProjectBySlug(slug);
        setProject(data || null);
      }
      setLoading(false);
    });
  }, [slug]);

  if (loading) {
    return (
      <div className="py-48">
        <div className="text-center py-12">
          <p className="text-text-secondary text-lg">加载中...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="py-48">
        <div className="text-center py-12">
          <p className="text-text-secondary text-lg mb-4">项目未找到</p>
          <BackButton to="/projects" />
        </div>
      </div>
    );
  }

  const { frontmatter, content } = project;
  const statusInfo = PROJECT_STATUS_MAP[frontmatter.status] || {
    label: frontmatter.status || '未知',
    color: 'text-text-secondary',
  };

  return (
    <div className="py-48">
      {/* 返回按钮 */}
      <div className="mb-8">
        <BackButton to="/projects" />
      </div>

      {/* 项目头部信息 */}
      <div className="mb-6">
        <GlassCard className="!pt-8 !px-10 !pb-8">
          {/* 项目标题 */}
          <div className="mb-4">
            <h1 className="text-5xl font-bold text-text-primary leading-tight">
              {frontmatter.title}
            </h1>
            {frontmatter.englishTitle && (
              <p className="text-2xl text-text-secondary/80 mt-2 font-medium">
                {frontmatter.englishTitle}
              </p>
            )}
          </div>

          {/* 元数据 */}
          <div className="flex flex-wrap items-center gap-4 mb-4">
            {/* 状态药丸 */}
            <span className={`inline-flex items-center !px-3 !py-1 rounded-full text-sm font-medium glass-card !p-0 border ${
              frontmatter.statusColor
                ? {
                    red: 'bg-red-500/10 text-red-200 border-red-500/20 backdrop-blur-sm',
                    white: 'bg-white/10 text-white border-white/20 backdrop-blur-sm',
                    green: 'bg-green-500/10 text-green-200 border-green-500/20 backdrop-blur-sm',
                    blue: 'bg-blue-500/10 text-blue-200 border-blue-500/20 backdrop-blur-sm',
                  }[frontmatter.statusColor]
                : 'bg-glass-200 text-text-secondary border-glass-300'
            }`}>
              {statusInfo.label}
            </span>

            {/* 日期 */}
            <div className="flex items-center gap-2">
              <span className="text-text-secondary text-sm">开始于:</span>
              <span className="text-text-secondary text-sm">
                {new Date(frontmatter.date).toLocaleDateString('zh-CN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>

            {/* 外部链接 */}
            {frontmatter.link && (
              <a
                href={frontmatter.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-primary bg-glass-100 hover:bg-glass-200 transition-all"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
                GitHub仓库
              </a>
            )}
          </div>

          {/* 技术标签 */}
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

      {/* 项目内容 */}
      <GlassCard className="!px-10 !pt-4 !pb-8" hover={false}>
        <MarkdownRenderer content={content} style="project" />
      </GlassCard>
    </div>
  );
}
