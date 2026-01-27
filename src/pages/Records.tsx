/**
 * Records 记录列表页组件
 *
 * 展示所有记录（电影、书籍、游戏、音乐）
 */

import { Records as RecordsSection } from '../components/sections/Records';
import { BackButton } from '../components/ui/BackButton';

/**
 * Records 页面组件
 */
export function Records() {
  return (
    <div className="py-48">
      {/* 返回按钮 */}
      <div className="mb-8">
        <BackButton to="/" />
      </div>

      {/* 页面标题 */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-text-primary mb-2">
          记录
        </h1>
        <p className="text-text-secondary text-lg">
          电影、书籍、游戏与音乐收藏
        </p>
      </div>

      {/* 记录列表区块 */}
      <RecordsSection />
    </div>
  );
}
