/**
 * AiLab AI 工具实验室页面组件
 *
 * 展示 AI 工具项目
 */

import { GlassCard } from '../components/ui/GlassCard';
import { BackButton } from '../components/ui/BackButton';
import { AnimatedWrapper } from '../components/ui/AnimatedWrapper';

/**
 * AiLab 页面组件
 */
export function AiLab() {
  return (
    <div className="py-48">
      {/* 返回按钮 */}
      <div className="mb-8">
        <BackButton to="/" />
      </div>

      {/* 页面标题 */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-text-primary mb-2">
          AI Lab
        </h1>
        <p className="text-text-secondary text-lg">
          我的 AI 工具实验
        </p>
      </div>

      {/* AI 工具卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
        <AnimatedWrapper delay={0}>
          <GlassCard
            hover
            onClick={() => window.open('https://jarvis-daily-work-log.pages.dev/', '_blank')}
          >
            <div>
              <h2 className="text-2xl font-bold text-text-primary mb-2">
                Jarvis's Daily Work Log
              </h2>
              <p className="text-text-secondary mb-4">
                智能化的日常工作记录工具
              </p>
              <p className="text-sm text-text-secondary">
                点击访问 →
              </p>
            </div>
          </GlassCard>
        </AnimatedWrapper>

        <AnimatedWrapper delay={100}>
          <GlassCard
            hover
            onClick={() => window.open('https://jarvis-daily-work-log.pages.dev/', '_blank')}
          >
            <div>
              <h2 className="text-2xl font-bold text-text-primary mb-2">
                Jarvis Notes
              </h2>
              <p className="text-text-secondary mb-4">
                文章总结与知识管理工具
              </p>
              <p className="text-sm text-text-secondary">
                点击访问 →
              </p>
            </div>
          </GlassCard>
        </AnimatedWrapper>
      </div>
    </div>
  );
}
