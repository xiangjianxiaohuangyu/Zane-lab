/**
 * Writing 专属解析器
 *
 * 处理写作类型的 Markdown 文件，协调 category 专属解析器
 */

import { BaseParser } from '../base/BaseParser';
import type { WritingFrontmatter } from '../../types';
import type { ValidationResult, ValidationError, ValidationWarning } from '../base/ParserInterface';
import type { ICategoryParser } from '../base/ParserInterface';
import { EssayParser } from './category/EssayParser';
import { AnnualParser } from './category/AnnualParser';
import { FictionParser } from './category/FictionParser';
import { PoetryParser } from './category/PoetryParser';

/**
 * Writing 解析器
 *
 * - 根据文件路径自动检测 category
 * - 委托给 category 专属解析器处理
 * - 验证 category 枚举值
 * - 合并 category 专属的元数据
 */
export class WritingParser extends BaseParser<WritingFrontmatter> {
  protected type = 'writing';

  /**
   * Category 专属解析器映射
   */
  private categoryParsers: Record<string, ICategoryParser<WritingFrontmatter>> = {
    essay: new EssayParser(),
    annual: new AnnualParser(),
    fiction: new FictionParser(),
    poetry: new PoetryParser(),
  };

  /**
   * 解析 Writing 内容
   *
   * 1. 检测或使用指定的 category
   * 2. 委托给对应的 category 解析器
   * 3. 合并 category 专属的元数据
   *
   * @param file - Markdown 文件内容
   * @param slug - 内容的唯一标识符
   * @param filePath - 文件路径（用于自动检测 category）
   */
  async parse(file: string, slug: string, filePath?: string): Promise<any> {
    // 先进行基础解析
    const baseResult = await super.parse(file, slug);

    // 检测 category
    let category = baseResult.frontmatter.category;

    // 如果 frontmatter 中没有指定 category，根据文件路径自动检测
    if (!category && filePath) {
      category = this.detectCategoryFromPath(filePath);
    }

    // 如果还是没有 category，使用默认值
    if (!category) {
      category = 'essay';
    }

    // 获取对应的 category 解析器
    const categoryParser = this.categoryParsers[category];

    if (categoryParser) {
      // 使用 category 解析器重新解析，以获取 category 专属的处理
      const categoryResult = await categoryParser.parse(file, slug);

      // 合并结果
      return {
        ...baseResult,
        frontmatter: {
          ...baseResult.frontmatter,
          ...categoryResult.frontmatter,
          category: category as WritingFrontmatter['category'], // 确保 category 类型正确
        },
        metadata: {
          ...baseResult.metadata,
          ...categoryResult.metadata,
        },
      };
    }

    // 如果没有找到对应的 category 解析器，返回基础解析结果
    return {
      ...baseResult,
      frontmatter: {
        ...baseResult.frontmatter,
        category: category as WritingFrontmatter['category'],
      },
    };
  }

  /**
   * 从文件路径检测 category
   *
   * @param filePath - 文件路径
   * @returns 检测到的 category
   */
  private detectCategoryFromPath(filePath: string): WritingFrontmatter['category'] {
    const path = filePath.toLowerCase();

    // 根据路径中的关键词检测 category
    if (path.includes('/fiction/')) return 'fiction';
    if (path.includes('/annual/')) return 'annual';
    if (path.includes('/essays/') || path.includes('/essay/')) return 'essay';
    if (path.includes('/poetry/') || path.includes('/poem/')) return 'poetry';

    // 默认为 essay
    return 'essay';
  }

  /**
   * 验证 Writing frontmatter
   */
  validate(data: Record<string, any>): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // 1. 验证必填字段
    const requiredFields = ['title', 'description', 'date', 'tags'];
    errors.push(...this.validateRequiredFields(data, requiredFields));

    // 2. 验证 tags 是数组
    const tagsError = this.validateArray(data, 'tags');
    if (tagsError) errors.push(tagsError);

    // 3. 验证日期格式
    const dateError = this.validateDate(data, 'date');
    if (dateError) errors.push(dateError);

    // 4. 验证 category 枚举（现在包括 poetry）
    const validCategories = ['essay', 'annual', 'fiction', 'poetry'];
    const categoryError = this.validateEnum(data, 'category', validCategories);
    if (categoryError) errors.push(categoryError);

    // 5. 验证 readTime（如果提供）
    if (data.readTime !== undefined && (typeof data.readTime !== 'number' || data.readTime < 0)) {
      warnings.push({
        field: 'readTime',
        message: 'readTime 应为正数',
        suggestion: 'readTime 将自动计算，如果不提供的话',
      });
    }

    // 6. 验证 showToc（如果提供）
    if (data.showToc !== undefined && typeof data.showToc !== 'boolean') {
      errors.push({
        field: 'showToc',
        message: 'showToc 必须是布尔值',
        severity: 'error',
        value: data.showToc,
      });
    }

    return {
      valid: errors.filter((e) => e.severity === 'critical').length === 0,
      errors,
      warnings,
    };
  }

  /**
   * 处理 Writing 专属的 frontmatter
   */
  protected async processFrontmatter(
    data: Record<string, any>
  ): Promise<Record<string, any>> {
    // 确保 category 存在
    return {
      ...data,
      category: data.category || 'essay',
      showToc: data.showToc ?? false,
    };
  }
}
