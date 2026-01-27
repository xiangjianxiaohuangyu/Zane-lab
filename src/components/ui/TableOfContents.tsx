/**
 * TableOfContents 目录组件
 *
 * 显示文章的目录结构，支持点击跳转和滚动高亮
 */

import { useEffect, useState } from 'react';
import type { TocItem } from '@/lib/toc';

/**
 * TableOfContents 组件属性
 */
interface TableOfContentsProps {
  /** 目录项数组 */
  toc: TocItem[];
}

/**
 * 目录组件
 */
export function TableOfContents({ toc }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');

  // 监听滚动，高亮当前章节
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            if (id) setActiveId(id);
          }
        });
      },
      {
        rootMargin: '-20% 0px -70% 0px', // 视口中间区域触发
      }
    );

    // 观察所有标题元素
    toc.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [toc]);

  // 点击跳转
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // 顶部偏移量
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  if (toc.length === 0) {
    return null;
  }

  return (
    <nav className="hidden lg:block">
      <div className="fixed left-8 top-86 w-38 max-h-[60vh] overflow-y-auto overflow-x-hidden">
        <div className="py-4">
          <h4 className="text-sm font-semibold text-text-primary mb-3 px-2">
            目录
          </h4>
          <ul className="space-y-3 relative">
            {/* 左侧垂直线 */}
            <div className="absolute left-[7px] top-2 bottom-2 w-[2px] bg-gradient-to-b from-glass-300 via-glass-200 to-transparent"></div>

            {toc.map((item) => (
              <li
                key={item.id}
                className="text-sm transition-colors duration-200 relative"
                style={{ marginLeft: `${(item.level - 1) * 16}px` }}
              >
                {/* 左侧圆点 */}
                <div
                  className={`absolute left-[5px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full border-2 transition-all duration-200 ${
                    activeId === item.id
                      ? 'bg-primary border-primary shadow-lg shadow-primary/50'
                      : 'bg-glass-800 border-glass-400'
                  }`}
                  style={{ left: `${(item.level - 1) * 16 + 5}px` }}
                ></div>

                <a
                  href={`#${item.id}`}
                  onClick={(e) => handleClick(e, item.id)}
                  className={`
                    block hover:text-primary transition-colors duration-200 px-2 py-1 pl-6
                    ${
                      activeId === item.id
                        ? 'text-primary font-medium'
                        : 'text-text-secondary'
                    }
                  `}
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
