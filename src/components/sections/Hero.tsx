
/**
 * Hero 首页欢迎区组件
 *
 * 显示在首页中央的欢迎文案
 * 包含主标题和副标题
 * 设计风格：克制、简约、大气
 *
 * @example
 * ```tsx
 * <Hero />
 * ```
 */
export function Hero() {
  return (
    <section className="min-h-[50vh] flex items-center justify-center pt-20">
      <div className="text-center max-w-4xl mx-auto px-6">
        {/* 主标题 */}
        <h1 className="text-5xl md:text-7xl font-bold text-text-primary mb-6 animate-fade-in">
          这里是我的数字空间
        </h1>

        {/* 副标题 */}
        <p className="text-xl md:text-2xl text-text-secondary mb-8 animate-fade-in-up">
          思考 · 记录 · 构建
        </p>

        {/* 说明文字 */}
        <p className="text-text-secondary/80 text-lg max-w-2xl mx-auto animate-fade-in-up">
          一个用于沉淀想法、展示作品、长期记录的个人空间
        </p>
      </div>
    </section>
  );
}
