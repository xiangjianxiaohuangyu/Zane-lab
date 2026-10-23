import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

/**
 * 导航链接配置
 */
const navLinks = [
  {path: '/', label: '首页'},
  {path: '/projects', label: '项目'},
  {path: '/writing', label: '写作'},
  {path: '/records', label: '记录'},
  {path: '/ai-lab', label: 'AI Lab'},
];

/**
 * 触发隐藏的最小滚动距离（px）
 * 页面顶部这段距离内导航始终显示
 */
const HIDE_THRESHOLD = 120;

/**
 * 判定滚动方向的最小位移（px）
 * 过滤触控板与惯性滚动产生的微小抖动，避免导航闪烁
 */
const SCROLL_DELTA_THRESHOLD = 8;

/**
 * Header 导航组件
 *
 * 固定在页面右上角的药丸型液态玻璃导航栏
 * 特点：
 * - 固定定位在右上角
 * - 药丸型外观（全圆角）
 * - 液态玻璃效果（毛玻璃 + 半透明）
 * - 滚动方向感知：向下滚动时上滑隐藏，向上滚动时滑回显示
 * - 移动端自动收窄内边距与字号，保证 5 个链接单行放下
 * - 当前页面高亮
 *
 * @example
 * ```tsx
 * <Header />
 * ```
 */
export function Header() {
  const location = useLocation();
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);

  /**
   * 判断当前路径是否激活
   */
  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  // 路由切换后回到页面顶部，此时导航应重新显示
  useEffect(() => {
    setHidden(false);
    lastScrollY.current = 0;
  }, [location.pathname]);

  // 滚动方向感知：向下滚隐藏，向上滚显示
  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY.current;

      // 位移过小视为抖动，忽略
      if (Math.abs(delta) < SCROLL_DELTA_THRESHOLD) return;

      setHidden(delta > 0 && currentY > HIDE_THRESHOLD);
      lastScrollY.current = currentY;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`
        fixed
        top-6
        right-6
        z-50
        transition-transform
        duration-300
        ease-out
        ${hidden ? '-translate-y-24' : 'translate-y-0'}
      `}
    >
      <nav
        className="
          glass-card
          !p-2
          !rounded-full
          flex
          items-center
          gap-1
        "
      >
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`
              relative
              px-3
              py-2
              md:px-4
              rounded-full
              text-xs
              md:text-sm
              font-medium
              whitespace-nowrap
              transition-all
              duration-300
              ${isActive(link.path)
                ? 'text-primary bg-glass-200'
                : 'text-text-secondary hover:text-text-primary hover:bg-glass-100'
              }
            `}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}