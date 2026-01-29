/**
 * Home 首页组件
 *
 * 网站的主页，展示欢迎文案和功能入口
 */

import { Hero } from '../components/sections/Hero';
import { FeatureCard } from '../components/cards/FeatureCard';

/**
 * Home 组件
 *
 * 首页结构：
 * 1. Hero 欢迎区
 * 2. 三张功能卡片（项目、写作、记录）
 */
export function Home() {
  return (
    <div className="min-h-screen">
      {/* 欢迎文案区 */}
      <Hero />

      {/* 功能卡片区 */}
      <section className="py-8 -mt-8 md:-mt-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 项目卡片 */}
          <FeatureCard
            icon="💻"
            title="项目"
            description="探索我的创意作品和技术实验"
            to="/projects"
          />

          {/* 写作卡片 */}
          <FeatureCard
            icon="✍️"
            title="写作"
            description="随笔、年终总结与小说创作"
            to="/writing"
          />

          {/* 记录卡片 */}
          <FeatureCard
            icon="📚"
            title="记录"
            description="电影、书籍、游戏与音乐收藏"
            to="/records"
          />
        </div>
      </section>
    </div>
  );
}
