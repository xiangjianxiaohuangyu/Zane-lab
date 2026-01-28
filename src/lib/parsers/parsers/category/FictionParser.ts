/**
 * Fiction Category 专属解析器
 *
 * 处理小说类型的写作内容
 */

import { BaseParser } from '../../base/BaseParser';
import type { WritingFrontmatter } from '../../../types';
import type { ICategoryParser } from '../../base/ParserInterface';

/**
 * Fiction 解析器
 *
 * 小说专属处理：
 * - 默认 showToc: true（小说通常需要目录）
 * - 默认 statusColor: 'white'
 * - 可能需要章节处理
 */
export class FictionParser extends BaseParser<WritingFrontmatter> implements ICategoryParser<WritingFrontmatter> {
  protected type = 'fiction';

  /**
   * 获取支持的 category
   */
  getCategory(): string {
    return 'fiction';
  }

  /**
   * 验证 Fiction frontmatter
   */
  validate(data: Record<string, any>): import('../../base/ParserInterface').ValidationResult {
    const errors: import('../../base/ParserInterface').ValidationError[] = [];
    const warnings: import('../../base/ParserInterface').ValidationWarning[] = [];

    // 必填字段
    if (!data.title) {
      errors.push({
        field: 'title',
        message: '小说必须有标题',
        severity: 'critical',
      });
    }

    if (!data.description) {
      errors.push({
        field: 'description',
        message: '小说必须有简介',
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
   * 处理 Fiction 专属的 frontmatter
   */
  protected async processFrontmatter(
    data: Record<string, any>
  ): Promise<Record<string, any>> {
    return {
      ...data,
      showToc: data.showToc ?? true, // 小说默认显示目录
      statusColor: data.statusColor || 'white', // 小说默认白色
    };
  }

  /**
   * 处理 Fiction 特定的逻辑
   *
   * 可能提取章节信息
   */
  async processCategorySpecific(_data: any, content: string): Promise<any> {
    // 提取章节数（如果使用 ## 或 ### 标记）
    const chapterMatches = content.match(/^#{2,3}\s+.+$/gm);
    const chapterCount = chapterMatches ? chapterMatches.length : 0;

    return {
      chapterCount,
    };
  }

  /**
   * 提取额外的元数据
   *
   * 添加小说专属的元数据
   */
  protected async extractAdditionalMetadata(
    rawContent: string,
    _htmlContent: string
  ): Promise<import('../../base/ParserInterface').ContentMetadata> {
    const chapterMatches = rawContent.match(/^#{2,3}\s+.+$/gm);
    const chapterCount = chapterMatches ? chapterMatches.length : 0;

    return {
      chapterCount,
    };
  }
}
