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
 * Header 导航组件
 *
 * 固定在页面右上角的药丸型液态玻璃导航栏
 * 特点：
 * - 固定定位在右上角
 * - 药丸型外观（全圆角）
 * - 液态玻璃效果（毛玻璃 + 半透明）
 * - 响应式设计
 * - 当前页面高亮
 *
 * @example
 * ```tsx
 * <Header />
 * ```
 */
export function Header() {
  const location = useLocation();

  /**
   * 判断当前路径是否激活
   */
  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className="fixed top-6 right-6 z-50">
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
              px-4
              py-2
              rounded-full
              text-sm
              font-medium
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
