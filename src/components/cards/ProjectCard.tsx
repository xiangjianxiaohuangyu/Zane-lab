import { Link } from 'react-router-dom';
import { GlassCard } from '../ui/GlassCard';
import { Badge } from '../ui/Badge';
import type { Content } from '@/lib/types';
import type { ProjectFrontmatter } from '@/lib/types';
import { PROJECT_STATUS_MAP } from '@/lib/types';

/**
 * ProjectCard 组件属性
 */
interface ProjectCardProps {
  /** 项目内容 */
  project: Content<ProjectFrontmatter>;
}

/**
 * 项目卡片组件
 *
 * 用于展示单个项目信息的卡片
 * 显示项目标题、描述、技术标签和状态
 *
 * @example
 * ```tsx
 * <ProjectCard project={projectData} />
 * ```
 */
export function ProjectCard({ project }: ProjectCardProps) {
  const { frontmatter, slug } = project;
  const statusInfo = PROJECT_STATUS_MAP[frontmatter.status] || {
    label: frontmatter.status || '未知',
    color: 'text-text-secondary',
  };

  // 状态颜色映射 - 包含液态玻璃效果
  const statusColorMap = {
    red: 'bg-red-500/10 text-red-200 border-red-500/20 backdrop-blur-sm',
    white: 'bg-white/10 text-white border-white/20 backdrop-blur-sm',
    green: 'bg-green-500/10 text-green-200 border-green-500/20 backdrop-blur-sm',
    blue: 'bg-blue-500/10 text-blue-200 border-blue-500/20 backdrop-blur-sm',
  };

  const statusColorClass = frontmatter.statusColor
    ? statusColorMap[frontmatter.statusColor]
    : 'bg-glass-200 text-text-secondary border-glass-300';

  return (
    <Link to={`/projects/${slug}`} className="block h-full">
      <GlassCard hover className="h-full flex flex-col !px-8 !pt-8 !pb-4">
        {/* 项目标题 + 状态药丸 */}
        <div className="flex items-center gap-3 mb-4">
          <h3 className="text-xl font-semibold text-text-primary">
            {frontmatter.title || '未命名项目'}
          </h3>
          <span className={`inline-flex items-center !px-3 !py-1 rounded-full text-sm font-medium glass-card !p-0 border ${statusColorClass}`}>
            {statusInfo.label}
          </span>
        </div>

        {/* 项目描述 */}
        <p className="text-text-secondary mb-8 flex-grow whitespace-pre-line">
          {frontmatter.description || '暂无描述'}
        </p>

        {/* 技术标签 */}
        {frontmatter.tags && frontmatter.tags.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-2">
            {frontmatter.tags.map((tag) => (
              <Badge key={tag} variant="default">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* 底部信息：日期和版本号 */}
        <div className="flex items-center justify-between text-sm text-text-secondary pt-4 border-t border-glass-200">
          {/* 日期 */}
          {frontmatter.date && (
            <span>
              {new Date(frontmatter.date).toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          )}

          {/* 版本号药丸 */}
          {frontmatter.version && (
            <span className="inline-flex items-center !px-3 !py-1 rounded-full text-xs font-medium glass-card border bg-glass-200 text-text-secondary border-glass-300">
              {frontmatter.version}
            </span>
          )}
        </div>

        
        
      </GlassCard>
    </Link>
  );
}
