/**
 * Annual Category 专属解析器
 *
 * 处理年终总结类型的写作内容
 */

import { BaseParser } from '../../base/BaseParser';
import type { WritingFrontmatter } from '../../../types';
import type { ICategoryParser } from '../../base/ParserInterface';

/**
 * Annual 解析器
 *
 * 年终总结专属处理：
 * - 默认 showToc: true（年终总结需要目录）
 * - 默认 statusColor: 'green'
 * - 可能需要年份提取和验证
 */
export class AnnualParser extends BaseParser<WritingFrontmatter> implements ICategoryParser<WritingFrontmatter> {
  protected type = 'annual';

  /**
   * 获取支持的 category
   */
  getCategory(): string {
    return 'annual';
  }

  /**
   * 验证 Annual frontmatter
   */
  validate(data: Record<string, any>): import('../../base/ParserInterface').ValidationResult {
    const errors: import('../../base/ParserInterface').ValidationError[] = [];
    const warnings: import('../../base/ParserInterface').ValidationWarning[] = [];

    // 必填字段
    if (!data.title) {
      errors.push({
        field: 'title',
        message: '年终总结必须有标题',
        severity: 'critical',
      });
    }

    if (!data.description) {
      errors.push({
        field: 'description',
        message: '年终总结必须有简介',
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

      // 年终总结的日期应该是年份或年份-月份格式
      if (data.date && !/^\d{4}(-\d{2})?$/.test(data.date)) {
        warnings.push({
          field: 'date',
          message: '年终总结的日期建议使用年份格式（如 "2024" 或 "2024-12"）',
          suggestion: '使用 YYYY 或 YYYY-MM 格式',
        });
      }
    }

    return {
      valid: errors.filter((e) => e.severity === 'critical').length === 0,
      errors,
      warnings,
    };
  }

  /**
   * 处理 Annual 专属的 frontmatter
   */
  protected async processFrontmatter(
    data: Record<string, any>
  ): Promise<Record<string, any>> {
    return {
      ...data,
      showToc: data.showToc ?? true, // 年终总结默认显示目录
      statusColor: data.statusColor || 'green', // 年终总结默认绿色
    };
  }

  /**
   * 处理 Annual 特定的逻辑
   */
  async processCategorySpecific(data: any, _content: string): Promise<any> {
    // 提取年份（如果可能）
    let year: number | undefined;

    if (data.date) {
      const yearMatch = data.date.match(/^\d{4}/);
      if (yearMatch) {
        year = parseInt(yearMatch[0], 10);
      }
    }

    return {
      year,
    };
  }
}
