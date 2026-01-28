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
        <div className="flex items-center gap-4 mb-2">
          <h1 className="text-4xl font-bold text-text-primary">
            记录
          </h1>
          <a
            href="https://www.douban.com/people/227180810/?_i=9591556QjA0V5o"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-glass-300 backdrop-blur-md border border-glass-100 rounded-full text-sm text-text-primary hover:bg-glass-400 transition-all duration-200"
          >
            查看我的豆瓣主页
          </a>
        </div>
        <p className="text-text-secondary text-lg">
          电影、书籍、游戏与音乐收藏
        </p>
      </div>

      {/* 记录列表区块 */}
      <RecordsSection />
    </div>
  );
}
