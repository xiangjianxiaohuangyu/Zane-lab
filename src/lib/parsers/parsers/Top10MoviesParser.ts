/**
 * 影史十佳专属解析器
 *
 * 处理影史十佳榜单的 Markdown 文件
 */

import { BaseParser } from '../base/BaseParser';
import type { Top10MovieFrontmatter } from '../../types';
import type { ValidationResult, ValidationError, ParseResult } from '../base/ParserInterface';

/**
 * 影史十佳解析器
 *
 * 验证和解析影史十佳 frontmatter，支持：
 * - Num 范围验证（1-10）
 * - 必填字段验证
 * - 多记录解析
 */
export class Top10MoviesParser extends BaseParser<Top10MovieFrontmatter> {
  protected type = 'top10-movie';

  /**
   * 验证影史十佳 frontmatter
   */
  validate(data: Record<string, any>): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: any[] = [];

    // 1. 验证必填字段
    const requiredFields = ['num', 'name'];
    errors.push(...this.validateRequiredFields(data, requiredFields));

    // 2. 验证 num 范围 (1-10)
    if (data.num !== undefined) {
      const num = Number(data.num);
      if (isNaN(num) || num < 1 || num > 10) {
        errors.push({
          field: 'num',
          message: 'num must be between 1 and 10',
          severity: 'critical',
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
   * 处理影史十佳专属的 frontmatter
   *
   * - 确保 num 是数字类型
   */
  protected async processFrontmatter(
    data: Record<string, any>
  ): Promise<Record<string, any>> {
    return {
      ...data,
      num: Number(data.num),
    };
  }

  /**
   * 解析包含多个影史十佳记录的文件
   *
   * 用于解析单个文件中包含多个连续 frontmatter 块的格式
   * 每个块使用 `---` 分隔符分隔
   *
   * @param file - 包含多个 frontmatter 块的文件内容
   * @returns 解析后的记录数组（过滤掉 name 为空的记录）
   */
  async parseMultiRecords(file: string): Promise<ParseResult<Top10MovieFrontmatter>[]> {
    // 统一换行符为 Unix 格式 (\n)
    let content = file.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

    // 移除文件开头和结尾的空白
    content = content.trim();

    // 移除开头的 ---（如果有）
    if (content.startsWith('---')) {
      content = content.substring(3).trim();
    }

    // 按 \n---\n 分割文件内容
    const rawBlocks = content.split(/\n---\n/);

    // 清理每个块：移除开头的 --- 和空白
    const blocks = rawBlocks
      .map((block) => {
        // 移除块开头的 ---（如果有）
        let cleaned = block.trim();
        if (cleaned.startsWith('---')) {
          cleaned = cleaned.substring(3).trim();
        }
        return cleaned;
      })
      .filter((block) => block.trim());

    // 调试日志
    console.log(`[Top10MoviesParser] Parsing file, found ${blocks.length} blocks`);

    // 为每个块添加开头的 ---，使其成为有效的 frontmatter 格式
    const results = await Promise.all(
      blocks.map(async (block, index) => {
        // 生成唯一 slug
        const slug = `top10-${index}`;
        // 添加开头的 ---
        const formattedBlock = `---\n${block}`;
        const result = await this.parse(formattedBlock, slug);
        console.log(`[Top10MoviesParser] Parsed block ${index}:`, result.frontmatter.name);
        return result;
      })
    );

    // 过滤掉 name 为空的记录
    const filteredResults = results.filter(
      (result) => result.frontmatter.name && result.frontmatter.name.trim() !== ''
    );

    console.log(`[Top10MoviesParser] Total parsed records: ${results.length}, after filtering: ${filteredResults.length}`);
    return filteredResults;
  }
}
