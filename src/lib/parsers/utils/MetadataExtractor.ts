/**
 * 元数据提取器
 *
 * 从 Markdown 内容中自动提取元数据
 */

import { extractToc } from '../../toc';
import type { TocItem } from '../../toc';
import type { ContentMetadata } from '../base/ParserInterface';

/**
 * 元数据提取器类
 *
 * 提供各种元数据提取功能
 */
export class MetadataExtractor {
  /**
   * 字数统计（支持中英文混合）
   *
   * @param content - Markdown 原始内容
   * @returns 字数
   *
   * @example
   * ```typescript
   * const count = MetadataExtractor.countWords('Hello 你好');
   * // 3 (2个英文单词 + 1个中文字符)
   * ```
   */
  static countWords(content: string): number {
    // 匹配英文单词（由字母组成）
    const englishWords = content.match(/[a-zA-Z]+/g)?.length || 0;

    // 匹配中文字符（CJK统一汉字）
    const chineseChars = content.match(/[\u4e00-\u9fa5]/g)?.length || 0;

    return englishWords + chineseChars;
  }

  /**
   * 计算阅读时间
   *
   * 基于平均阅读速度：
   * - 英文：300 词/分钟
   * - 中文：500 字/分钟
   * - 混合内容使用加权平均
   *
   * @param wordCount - 字数
   * @param content - 内容（用于计算中英文比例）
   * @returns 阅读时间（分钟）
   *
   * @example
   * ```typescript
   * const readTime = MetadataExtractor.calculateReadTime(1000, '...');
   * // 约 3-4 分钟
   * ```
   */
  static calculateReadTime(wordCount: number, content?: string): number {
    if (wordCount === 0) return 0;

    if (!content) {
      // 简单计算：假设平均 350 字/分钟
      return Math.ceil(wordCount / 350);
    }

    // 分别计算中英文
    const englishWords = content.match(/[a-zA-Z]+/g)?.length || 0;
    const chineseChars = content.match(/[\u4e00-\u9fa5]/g)?.length || 0;

    // 英文 300 词/分钟，中文 500 字/分钟
    const englishTime = englishWords / 300;
    const chineseTime = chineseChars / 500;

    // 向上取整
    return Math.ceil(englishTime + chineseTime);
  }

  /**
   * 提取目录结构
   *
   * @param html - HTML 内容
   * @returns 目录项数组
   *
   * @example
   * ```typescript
   * const toc = MetadataExtractor.extractToc('<h1 id="intro">简介</h1>');
   * // [{ id: 'intro', title: '简介', level: 1 }]
   * ```
   */
  static extractToc(html: string): TocItem[] {
    return extractToc(html);
  }

  /**
   * 分析诗歌内容
   *
   * 提取诗歌专属的元数据
   *
   * @param content - Markdown 原始内容
   * @returns 诗歌元数据
   *
   * @example
   * ```typescript
   * const poetryMeta = MetadataExtractor.analyzePoetry(`
   *   第一行
   *   第二行
   *
   *   第三行
   *   第四行
   * `);
   * // { lineCount: 4, stanzaCount: 2 }
   * ```
   */
  static analyzePoetry(content: string): {
    lineCount: number;
    stanzaCount: number;
  } {
    // 统计非空行数
    const lines = content
      .split('\n')
      .filter((line) => line.trim().length > 0);

    // 统计诗节数（以空行分隔）
    const stanzas = content
      .split(/\n\s*\n/)
      .filter((stanza) => stanza.trim().length > 0);

    return {
      lineCount: lines.length,
      stanzaCount: stanzas.length,
    };
  }

  /**
   * 提取所有元数据
   *
   * 一次性提取所有通用元数据
   *
   * @param rawContent - Markdown 原始内容
   * @param htmlContent - HTML 内容
   * @returns 元数据对象
   *
   * @example
   * ```typescript
   * const metadata = MetadataExtractor.extractAll(markdown, html);
   * // { wordCount: 500, readTime: 2, toc: [...] }
   * ```
   */
  static extractAll(
    rawContent: string,
    htmlContent: string
  ): ContentMetadata {
    const wordCount = this.countWords(rawContent);
    const readTime = this.calculateReadTime(wordCount, rawContent);
    const toc = this.extractToc(htmlContent);

    return {
      wordCount,
      readTime,
      toc,
    };
  }

  /**
   * 提取摘要
   *
   * 从内容开头提取指定长度的摘要
   *
   * @param content - 内容
   * @param maxLength - 最大长度（默认150字符）
   * @returns 摘要文本
   *
   * @example
   * ```typescript
   * const excerpt = MetadataExtractor.extractExcerpt(content, 100);
   * ```
   */
  static extractExcerpt(content: string, maxLength: number = 150): string {
    // 移除 Markdown 语法
    const plainText = content
      .replace(/^#{1,6}\s+/gm, '') // 移除标题
      .replace(/\*\*(.*?)\*\*/g, '$1') // 移除粗体
      .replace(/\*(.*?)\*/g, '$1') // 移除斜体
      .replace(/`(.*?)`/g, '$1') // 移除代码
      .replace(/\[(.*?)\]\(.*?\)/g, '$1') // 移除链接
      .replace(/\n+/g, ' ') // 换行替换为空格
      .trim();

    // 截断
    if (plainText.length <= maxLength) {
      return plainText;
    }

    return plainText.substring(0, maxLength).trim() + '...';
  }
}
