/**
 * Poetry Category 专属解析器
 *
 * 处理诗歌类型的写作内容
 */

import { BaseParser } from '../../base/BaseParser';
import type { WritingFrontmatter } from '../../../types';
import type { ICategoryParser } from '../../base/ParserInterface';
import { MetadataExtractor } from '../../utils/MetadataExtractor';

/**
 * Poetry 解析器
 *
 * 诗歌专属处理：
 * - 默认 showToc: false（诗歌不需要目录）
 * - 默认 statusColor: 'pink'
 * - 默认 readTime: 3 分钟
 * - 提取诗歌专属元数据（行数、诗节数）
 */
export class PoetryParser extends BaseParser<WritingFrontmatter> implements ICategoryParser<WritingFrontmatter> {
  protected type = 'poetry';

  /**
   * 获取支持的 category
   */
  getCategory(): string {
    return 'poetry';
  }

  /**
   * 验证 Poetry frontmatter
   *
   * 诗歌的要求相对宽松，只需标题即可
   */
  validate(data: Record<string, any>): import('../../base/ParserInterface').ValidationResult {
    const errors: import('../../base/ParserInterface').ValidationError[] = [];
    const warnings: import('../../base/ParserInterface').ValidationWarning[] = [];

    // 诗歌只需标题
    if (!data.title) {
      errors.push({
        field: 'title',
        message: '诗歌必须有标题',
        severity: 'critical',
      });
    }

    // 验证 tags 是数组（如果提供）
    if (data.tags) {
      const tagsError = this.validateArray(data, 'tags');
      if (tagsError) errors.push(tagsError);
    }

    // 日期格式验证（如果提供）
    if (data.date) {
      const dateError = this.validateDate(data, 'date');
      if (dateError) errors.push(dateError);
    }

    return {
      valid: errors.filter((e) => e.severity === 'critical').length === 0,
      errors,
      warnings,
    };
  }

  /**
   * 处理 Poetry 专属的 frontmatter
   *
   * 设置诗歌的默认值
   */
  protected async processFrontmatter(
    data: Record<string, any>
  ): Promise<Record<string, any>> {
    return {
      ...data,
      showToc: data.showToc ?? false, // 诗歌默认不显示目录
      statusColor: data.statusColor || 'pink', // 诗歌默认粉色
      readTime: data.readTime ?? 3, // 诗歌默认3分钟
    };
  }

  /**
   * 处理 Poetry 特定的逻辑
   *
   * 提取诗歌专属元数据
   */
  async processCategorySpecific(
    _data: any,
    content: string
  ): Promise<{ lineCount: number; stanzaCount: number }> {
    return MetadataExtractor.analyzePoetry(content);
  }

  /**
   * 提取额外的元数据
   *
   * 添加诗歌专属的元数据
   */
  protected async extractAdditionalMetadata(
    rawContent: string,
    _htmlContent: string
  ): Promise<import('../../base/ParserInterface').ContentMetadata> {
    const poetryMeta = MetadataExtractor.analyzePoetry(rawContent);

    return {
      lineCount: poetryMeta.lineCount,
      stanzaCount: poetryMeta.stanzaCount,
    };
  }
}
