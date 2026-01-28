/**
 * Project 专属解析器
 *
 * 处理项目类型的 Markdown 文件
 */

import { BaseParser } from '../base/BaseParser';
import type { ProjectFrontmatter } from '../../types';
import type { ValidationResult, ValidationError, ValidationWarning } from '../base/ParserInterface';

/**
 * Project 解析器
 *
 * 验证和解析项目 frontmatter，支持：
 * - 必填字段验证
 * - 状态值验证和映射
 * - statusColor 验证
 * - 日期格式验证
 */
export class ProjectParser extends BaseParser<ProjectFrontmatter> {
  protected type = 'project';

  /**
   * 验证 Project frontmatter
   */
  validate(data: Record<string, any>): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // 1. 验证必填字段
    const requiredFields = ['title', 'description', 'date', 'tags', 'status'];
    errors.push(...this.validateRequiredFields(data, requiredFields));

    // 2. 验证 tags 是数组
    const tagsError = this.validateArray(data, 'tags');
    if (tagsError) errors.push(tagsError);

    // 3. 验证 status 枚举
    const validStatuses = ['completed', 'in-progress', 'planned', '已完成', '进行中', '计划中'];
    const statusError = this.validateEnum(data, 'status', validStatuses);
    if (statusError) errors.push(statusError);

    // 4. 验证日期格式
    const dateError = this.validateDate(data, 'date');
    if (dateError) errors.push(dateError);

    // 5. 验证 statusColor（如果提供）
    if (data.statusColor) {
      const validColors = ['red', 'white', 'green', 'blue', 'yellow', 'pink'];
      if (!validColors.includes(data.statusColor)) {
        warnings.push({
          field: 'statusColor',
          message: `statusColor 应为以下值之一: ${validColors.join(', ')}`,
          suggestion: `使用建议的颜色: ${validColors.join(', ')}`,
        });
      }
    }

    // 6. 验证 version 格式（如果提供）
    if (data.version && typeof data.version !== 'string') {
      errors.push({
        field: 'version',
        message: 'version 必须是字符串',
        severity: 'error',
        value: data.version,
      });
    }

    return {
      valid: errors.filter((e) => e.severity === 'critical').length === 0,
      errors,
      warnings,
    };
  }

  /**
   * 处理 Project 专属的 frontmatter
   *
   * - 映射中文状态值到英文
   * - 设置默认 statusColor
   */
  protected async processFrontmatter(
    data: Record<string, any>
  ): Promise<Record<string, any>> {
    // 状态值映射（中文 → 英文）
    const statusMap: Record<string, string> = {
      已完成: 'completed',
      进行中: 'in-progress',
      计划中: 'planned',
    };

    // 转换状态值
    let status = data.status;
    if (statusMap[status]) {
      status = statusMap[status];
    }

    // 默认值
    const defaults = {
      statusColor: data.statusColor || 'blue',
    };

    return {
      ...data,
      status,
      ...defaults,
    };
  }
}
