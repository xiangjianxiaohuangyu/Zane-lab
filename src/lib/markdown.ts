import matter from 'gray-matter';
import { remark } from 'remark';
import remarkHtml from 'remark-html';
import remarkGfm from 'remark-gfm';

/**
 * 解析 Markdown 文件
 *
 * @param file - Markdown 文件的原始内容（字符串）
 * @returns 包含 frontmatter 和 HTML 内容的对象
 *
 * @example
 * ```typescript
 * const markdownContent = `
 * ---
 * title: "Hello"
 * date: "2025-01-27"
 * ---
 *
 * # Hello World
 * `;
 *
 * const result = await parseMarkdown(markdownContent);
 * console.log(result.frontmatter); // { title: "Hello", date: "2025-01-27" }
 * console.log(result.content); // "<h1>Hello World</h1>"
 * ```
 */
export async function parseMarkdown(file: string): Promise<{
  frontmatter: Record<string, any>;
  content: string;
}> {
  // 使用 gray-matter 提取 frontmatter 和内容
  const { data, content } = matter(file);

  // 使用 remark 将 markdown 转换为 HTML
  const processedContent = await remark()
    .use(remarkGfm) // 支持 GitHub Flavored Markdown (GFM)
    .use(remarkHtml, { sanitize: false }) // 转换为 HTML，不进行sanitize（允许HTML）
    .process(content);

  // 返回 frontmatter 和 HTML 内容
  return {
    frontmatter: data,
    content: processedContent.toString(),
  };
}

/**
 * 从文件路径提取 slug
 *
 * @param path - 文件的完整路径
 * @returns 文件名（不含扩展名）
 *
 * @example
 * ```typescript
 * const slug = extractSlug('/src/content/projects/my-project.md');
 * console.log(slug); // "my-project"
 * ```
 */
export function extractSlug(path: string): string {
  // 获取路径的最后一部分，然后移除 .md 扩展名
  const fileName = path.split('/').pop() || '';
  return fileName.replace('.md', '');
}
