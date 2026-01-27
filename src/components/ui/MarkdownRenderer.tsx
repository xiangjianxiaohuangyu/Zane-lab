
/**
 * MarkdownRenderer 组件属性
 */
interface MarkdownRendererProps {
  /** Markdown 转换后的 HTML 内容 */
  content: string;

  /** 自定义类名（可选） */
  className?: string;
}

/**
 * Markdown 渲染器组件
 *
 * 用于渲染从 Markdown 转换而来的 HTML 内容
 * 提供优雅的排版样式
 *
 * @example
 * ```tsx
 * <MarkdownRenderer content="<h1>标题</h1><p>段落</p>" />
 * ```
 */
export function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  return (
    <div
      className={`
        prose
        prose-invert
        max-w-none
        /* 标题样式 */
        prose-headings:font-bold
        prose-headings:text-text-primary
        prose-headings:mt-6
        prose-headings:mb-3
        prose-headings:leading-tight
        prose-h1:text-3xl
        prose-h1:mt-0
        prose-h1:mb-5
        prose-h1:tracking-tight
        prose-h2:text-2xl
        prose-h2:mt-8
        prose-h2:mb-4
        prose-h2:pb-2
        prose-h2:border-b
        prose-h2:border-glass-200
        prose-h2:tracking-tight
        prose-h3:text-xl
        prose-h3:mt-6
        prose-h3:mb-3
        prose-h4:text-lg
        prose-h4:mt-5
        prose-h4:mb-3
        prose-h5:text-base
        prose-h6:text-sm
        /* 段落样式 */
        prose-p:mb-4
        prose-p:leading-relaxed
        prose-p:text-text-secondary
        prose-p:indent-8
        /* 列表样式 */
        prose-ul:mb-4
        prose-ul:ml-4
        prose-ul:space-y-2
        prose-ol:mb-4
        prose-ol:ml-4
        prose-li:marker:text-text-secondary
        prose-li:text-indent-0
        prose-li:p:indent-0
        /* 链接样式 */
        prose-a:text-primary
        prose-a:no-underline
        prose-a:font-medium
        hover:prose-a:underline
        hover:prose-a:text-primary-light
        /* 粗体和斜体 */
        prose-strong:text-text-primary
        prose-strong:font-semibold
        prose-em:text-text-secondary
        /* 行内代码 */
        prose-code:text-primary
        prose-code:bg-glass-100
        prose-code:px-1.5
        prose-code:py-0.5
        prose-code:rounded
        prose-code:text-sm
        prose-code:font-mono
        /* 代码块 */
        prose-pre:bg-background-secondary
        prose-pre:border
        prose-pre:border-glass-200
        prose-pre:rounded-lg
        prose-pre:p-4
        prose-pre:mb-4
        prose-pre:mt-4
        prose-pre:shadow-sm
        /* 引用块 */
        prose-blockquote:border-l-4
        prose-blockquote:border-glass-300
        prose-blockquote:bg-glass-50
        prose-blockquote:py-2
        prose-blockquote:px-4
        prose-blockquote:my-4
        prose-blockquote:text-text-secondary
        prose-blockquote:italic
        /* 分隔线 */
        prose-hr:border-glass-200
        prose-hr:my-8
        /* 图片 */
        prose-img:rounded-lg
        prose-img:shadow-lg
        prose-img:my-6
        /* 表格 */
        prose-th:text-text-primary
        prose-th:font-semibold
        prose-th:border-glass-200
        prose-th:bg-glass-50
        prose-th:px-4
        prose-th:py-2
        prose-td:border-glass-200
        prose-td:px-4
        prose-td:py-2
        prose-tr:border-glass-200
        /* 自定义类名 */
        ${className}
      `.trim().replace(/\s+/g, ' ')}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
