
/**
 * Footer 页脚组件
 *
 * 显示在页面底部的页脚信息
 * 包含版权信息和社交链接
 *
 * @example
 * ```tsx
 * <Footer />
 * ```
 */
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto py-8 border-t border-glass-200">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* 版权信息 */}
          <div className="text-text-secondary text-sm">
            © {currentYear} Zane's Lab. 用心记录，持续构建。
          </div>

          {/* 社交链接（可选） */}
          <div className="flex gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-secondary hover:text-primary transition-colors text-sm"
            >
              GitHub
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-secondary hover:text-primary transition-colors text-sm"
            >
              Twitter
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
