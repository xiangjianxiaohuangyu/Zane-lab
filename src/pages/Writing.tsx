/**
 * Writing 写作列表页组件
 *
 * 展示所有写作内容（随笔、年终总结、小说）
 */

import { Writing as WritingSection } from '../components/sections/Writing';
import { BackButton } from '../components/ui/BackButton';

/**
 * Writing 页面组件
 */
export function Writing() {
  return (
    <div className="py-48">
      {/* 返回按钮 */}
      <div className="mb-8">
        <BackButton to="/" />
      </div>

      {/* 页面标题 */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-text-primary mb-2">
          写作
        </h1>
        <p className="text-text-secondary text-lg">
          随笔、年终总结与小说创作
        </p>
      </div>

      {/* 写作列表区块 */}
      <WritingSection />
    </div>
  );
}
