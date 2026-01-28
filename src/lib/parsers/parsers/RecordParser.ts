/**
 * Record 专属解析器
 *
 * 处理记录类型的 Markdown 文件（电影、书籍、游戏、音乐）
 */

import { BaseParser } from '../base/BaseParser';
import type { RecordFrontmatter } from '../../types';
import type { ValidationResult, ValidationError, ValidationWarning, ParseResult } from '../base/ParserInterface';

/**
 * Record 解析器
 *
 * 验证和解析记录 frontmatter，支持：
 * - Category 验证（movie/book/game/music）
 * - Category 专属字段验证
 * - Rating 范围验证（1-10）
 * - 必填字段验证
 */
export class RecordParser extends BaseParser<RecordFrontmatter> {
  protected type = 'record';

  /**
   * Category 专属字段配置
   */
  private readonly categoryFields = {
    movie: {
      optionalFields: ['director', 'cover'],
      recommendedFields: ['director'],
    },
    book: {
      optionalFields: ['author', 'cover'],
      recommendedFields: ['author'],
    },
    game: {
      optionalFields: ['developer', 'cover'],
      recommendedFields: ['developer'],
    },
    music: {
      optionalFields: ['artist', 'cover'],
      recommendedFields: ['artist'],
    },
  };

  /**
   * 验证 Record frontmatter
   */
  validate(data: Record<string, any>): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // 1. 验证必填字段
    const requiredFields = ['title', 'category', 'date'];
    errors.push(...this.validateRequiredFields(data, requiredFields));

    // 2. 验证 category 枚举
    const validCategories = ['movie', 'book', 'game', 'music'];
    const categoryError = this.validateEnum(data, 'category', validCategories);
    if (categoryError) errors.push(categoryError);

    // 3. 验证 tags 是数组
    const tagsError = this.validateArray(data, 'tags');
    if (tagsError) errors.push(tagsError);

    // 4. 验证日期格式
    const dateError = this.validateDate(data, 'date');
    if (dateError) errors.push(dateError);

    // 5. 验证 rating 范围（如果提供）
    if (data.rating !== undefined) {
      const ratingError = this.validateNumberRange(data, 'rating', 1, 10);
      if (ratingError) errors.push(ratingError);
    }

    // 6. Category 专属字段验证
    if (data.category) {
      const categoryWarnings = this.validateCategorySpecificFields(data);
      warnings.push(...categoryWarnings);
    }

    return {
      valid: errors.filter((e) => e.severity === 'critical').length === 0,
      errors,
      warnings,
    };
  }

  /**
   * 验证 category 专属字段
   *
   * 根据不同的 category，验证相应的推荐字段
   */
  private validateCategorySpecificFields(
    data: Record<string, any>
  ): ValidationWarning[] {
    const warnings: ValidationWarning[] = [];
    const category = data.category as keyof typeof this.categoryFields;

    if (!category || !this.categoryFields[category]) {
      return warnings;
    }

    const config = this.categoryFields[category];

    // 检查推荐字段
    for (const field of config.recommendedFields) {
      if (!data[field] && !data.notes) {
        warnings.push({
          field,
          message: `${category} 类型的记录建议包含 '${field}' 字段或 'notes'`,
          suggestion: `考虑添加 '${field}' 字段以提供更完整的信息`,
        });
      }
    }

    return warnings;
  }

  /**
   * 处理 Record 专属的 frontmatter
   *
   * - 确保 tags 数组存在
   * - 设置默认值
   */
  protected async processFrontmatter(
    data: Record<string, any>
  ): Promise<Record<string, any>> {
    // 默认值
    const defaults = {
      tags: data.tags || [],
      rating: data.rating ?? null, // 明确设置为 null 而不是 undefined
    };

    return {
      ...data,
      ...defaults,
    };
  }

  /**
   * 解析包含多个记录的文件
   *
   * 用于解析单个文件中包含多个连续 frontmatter 块的格式
   * 每个块使用 `---` 分隔符分隔
   *
   * @param file - 包含多个 frontmatter 块的文件内容
   * @param category - 记录分类（movie/book/game/music）
   * @returns 解析后的记录数组
   */
  async parseMultiRecords(
    file: string,
    category: string
  ): Promise<ParseResult<RecordFrontmatter>[]> {
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

    // 为每个块添加开头的 ---，使其成为有效的 frontmatter 格式
    const results = await Promise.all(
      blocks.map(async (block, index) => {
        // 生成唯一 slug：分类 + 内容哈希
        const slug = this.generateSlug(block, category, index);
        // 添加开头的 ---
        const formattedBlock = `---\n${block}`;
        const result = await this.parse(formattedBlock, slug);
        return result;
      })
    );

    return results;
  }

  /**
   * 为记录生成唯一的 slug
   *
   * 使用内容的简单哈希算法生成唯一标识符
   *
   * @param content - 记录内容
   * @param category - 记录分类
   * @param index - 记录在文件中的索引
   * @returns 唯一的 slug
   */
  private generateSlug(content: string, category: string, index: number): string {
    // 简单哈希算法
    let hash = 0;
    const str = content + index;

    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }

    // 转为正数并取十六进制
    const hexHash = Math.abs(hash).toString(16).padStart(8, '0');

    return `${category}-${hexHash}`;
  }
}
