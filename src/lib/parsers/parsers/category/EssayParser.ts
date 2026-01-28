/**
 * Essay Category 专属解析器
 *
 * 处理随笔类型的写作内容
 */

import { BaseParser } from '../../base/BaseParser';
import type { WritingFrontmatter } from '../../../types';
import type { ICategoryParser } from '../../base/ParserInterface';

/**
 * Essay 解析器
 *
 * 随笔专属处理：
 * - 默认 showToc: true（随笔通常需要目录）
 * - 默认 statusColor: 'blue'
 * - 验证 tags 数组
 */
export class EssayParser extends BaseParser<WritingFrontmatter> implements ICategoryParser<WritingFrontmatter> {
  protected type = 'essay';

  /**
   * 获取支持的 category
   */
  getCategory(): string {
    return 'essay';
  }

  /**
   * 验证 Essay frontmatter
   */
  validate(data: Record<string, any>): import('../../base/ParserInterface').ValidationResult {
    const errors: import('../../base/ParserInterface').ValidationError[] = [];
    const warnings: import('../../base/ParserInterface').ValidationWarning[] = [];

    // 必填字段
    if (!data.title) {
      errors.push({
        field: 'title',
        message: '随笔必须有标题',
        severity: 'critical',
      });
    }

    if (!data.description) {
      errors.push({
        field: 'description',
        message: '随笔必须有简介',
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
   * 处理 Essay 专属的 frontmatter
   */
  protected async processFrontmatter(
    data: Record<string, any>
  ): Promise<Record<string, any>> {
    return {
      ...data,
      showToc: data.showToc ?? true, // 随笔默认显示目录
      statusColor: data.statusColor || 'blue', // 随笔默认蓝色
    };
  }

  /**
   * 处理 Essay 特定的逻辑
   *
   * 随笔暂无特殊的 category-specific 处理
   */
  async processCategorySpecific(_data: any, _content: string): Promise<any> {
    // 随笔暂无特殊处理
    return {};
  }
}
