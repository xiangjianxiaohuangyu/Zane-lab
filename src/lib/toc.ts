/**
 * 目录（TOC）工具
 *
 * 从 HTML 内容中提取标题，生成文章目录
 */

/**
 * 目录项类型定义
 */
export interface TocItem {
  /** 标题的 ID（用于锚点跳转） */
  id: string;

  /** 标题文本 */
  title: string;

  /** 标题级别（2-6） */
  level: number;
}

/**
 * 从 HTML 内容中提取目录
 *
 * 提取所有 h1-h6 标题，生成目录结构
 *
 * @param html - Markdown 转换后的 HTML 内容
 * @returns 目录项数组
 *
 * @example
 * ```typescript
 * const html = '<h1 id="intro">简介</h1><h2 id="details">详情</h2>';
 * const toc = extractToc(html);
 * // [
 * //   { id: 'intro', title: '简介', level: 1 },
 * //   { id: 'details', title: '详情', level: 2 }
 * // ]
 * ```
 */
export function extractToc(html: string): TocItem[] {
  // 创建一个临时 DOM 解析器
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  // 提取所有 h1-h6 标题
  const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');

  const toc: TocItem[] = [];

  headings.forEach((heading) => {
    const id = heading.getAttribute('id');
    const title = heading.textContent?.trim() || '';

    // 只包含有 ID 的标题
    if (id) {
      toc.push({
        id,
        title,
        level: parseInt(heading.tagName.charAt(1)), // 提取 h1, h2 等中的数字
      });
    }
  });

  return toc;
}

/**
 * 生成 slug（用于测试或辅助功能）
 *
 * 将文本转换为 URL 友好的格式
 *
 * @param text - 原始文本
 * @returns slug 字符串
 *
 * @example
 * ```typescript
 * slugify('Hello World') // 'hello-world'
 * slugify('这是中文') // '这是中文'
 * ```
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // 空格替换为连字符
    .replace(/[^\w\u4e00-\u9fa5\-]+/g, ''); // 移除非单词字符（保留中文）
}
