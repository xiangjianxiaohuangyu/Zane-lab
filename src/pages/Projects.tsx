/**
 * Projects 项目列表页组件
 *
 * 展示所有项目
 */

import { Projects as ProjectsSection } from '../components/sections/Projects';
import { BackButton } from '../components/ui/BackButton';

/**
 * Projects 页面组件
 */
export function Projects() {
  return (
    <div className="py-48">
      {/* 返回按钮 */}
      <div className="mb-8">
        <BackButton to="/" />
      </div>

      {/* 页面标题 */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-text-primary mb-2">
          项目
        </h1>
        <p className="text-text-secondary text-lg">
          我的创意作品和技术实验
        </p>
      </div>

      {/* 项目列表区块 */}
      <ProjectsSection />
    </div>
  );
}
