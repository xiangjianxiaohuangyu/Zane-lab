/**
 * Remark 处理器
 *
 * 封装统一的 remark 处理管道，供所有解析器使用
 */

import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkSlug from 'remark-slug';
import remarkHtml from 'remark-html';
import type { Options } from 'remark-html';

/**
 * Remark 图片节点处理器
 *
 * 与 remark-html 支持的 handlers.image 签名一致
 */
export type ImageHandler = NonNullable<NonNullable<Options['handlers']>['image']>;

/**
 * Remark 处理器类
 *
 * 提供统一的 Markdown 到 HTML 的转换处理
 */
export class RemarkProcessor {
  private static processor = remark()
    .use(remarkGfm as any) // 支持 GitHub Flavored Markdown (表格、删除线等)
    .use(remarkSlug as any) // 为标题添加 ID 属性（支持锚点）
    .use(remarkHtml, { sanitize: false }); // 转换为 HTML，不进行 sanitize（允许 HTML）

  /**
   * 处理 Markdown 内容
   *
   * 将 Markdown 转换为 HTML
   *
   * @param content - Markdown 原始内容
   * @returns HTML 字符串
   *
   * @example
   * ```typescript
   * const html = await RemarkProcessor.process('# Hello World');
   * // '<h1>Hello World</h1>'
   * ```
   */
  static async process(content: string): Promise<string> {
    const result = await this.processor.process(content);
    return result.toString();
  }

  /**
   * 使用自定义图片处理器转换 Markdown
   *
   * 供需要定制图片标签（懒加载、可聚焦、ARIA 等）的解析器使用。
   * 插件顺序与 process() 保持一致，避免不同内容类型之间出现行为漂移。
   *
   * @param content - Markdown 原始内容
   * @param imageHandler - 自定义图片节点处理器
   * @returns HTML 字符串
   */
  static async processWithImageHandler(
    content: string,
    imageHandler: ImageHandler
  ): Promise<string> {
    const processor = remark()
      .use(remarkGfm as any)
      .use(remarkSlug as any)
      .use(remarkHtml, { sanitize: false, handlers: { image: imageHandler } });

    const result = await processor.process(content);
    return result.toString();
  }

  /**
   * 同步处理 Markdown 内容
   *
   * 注意：remark 的处理是异步的，此方法仅供特殊场景使用
   *
   * @param content - Markdown 原始内容
   * @returns HTML 字符串
   * @deprecated 使用 process() 方法代替
   */
  static processSync(content: string): string {
    return this.processor.processSync(content).toString();
  }

  /**
   * 创建自定义处理器
   *
   * 允许添加额外的 remark 插件
   *
   * @param plugins - 额外的 remark 插件数组
   * @returns 自定义的 remark 处理器
   *
   * @example
   * ```typescript
   * const customProcessor = RemarkProcessor.createCustom([
   *   remarkMath,
   *   remarkCodeTitles
   * ]);
   * ```
   */
  static createCustom(plugins: any[]) {
    let processor = remark();
    for (const plugin of plugins) {
      processor = processor.use(plugin);
    }
    return processor;
  }
}
