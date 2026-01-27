import { useState, useEffect } from 'react';
import { ProjectCard } from '../cards/ProjectCard';
import { AnimatedWrapper } from '../ui/AnimatedWrapper';
import { CardSkeleton } from '../ui/Skeleton';
import { getContent } from '@/lib/content';
import type { Content } from '@/lib/types';
import type { ProjectFrontmatter } from '@/lib/types';

/**
 * Projects 区块组件
 *
 * 项目列表区块，以网格布局展示所有项目
 * 用于首页或项目列表页
 *
 * @example
 * ```tsx
 * <Projects />
 * ```
 */
export function Projects() {
  const [projects, setProjects] = useState<Content<ProjectFrontmatter>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getContent()
      .then((data) => {
        console.log('Loaded projects:', data.projects);
        setProjects(data.projects);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Failed to load projects:', error);
        setLoading(false);
      });
  }, []);

  return (
    <section>
      {/* 加载状态 */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : projects.length > 0 ? (
        // 项目网格 - 使用 AnimatedWrapper 实现交错动画
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {projects.map((project, index) => (
            <AnimatedWrapper
              key={project.slug}
              delay={index * 100}
              animation="fade-in-up"
            >
              <ProjectCard project={project} />
            </AnimatedWrapper>
          ))}
        </div>
      ) : (
        // 空状态
        <div className="text-center py-12">
          <p className="text-text-secondary text-lg">
            暂无项目
          </p>
          <p className="text-text-secondary/60 text-sm mt-2">
            项目内容将在添加后自动显示
          </p>
        </div>
      )}
    </section>
  );
}
