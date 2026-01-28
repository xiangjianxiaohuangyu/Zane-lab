/**
 * 抽象解析器基类
 *
 * 为所有解析器提供通用的解析功能
 */

import matter from 'gray-matter';
import type {
  IParser,
  ParseResult,
  ValidationResult,
  ContentMetadata,
} from './ParserInterface';
import { ParserValidationError } from './ValidationError';
import { RemarkProcessor } from '../utils/RemarkProcessor';
import { MetadataExtractor } from '../utils/MetadataExtractor';

/**
 * 抽象解析器基类
 *
 * 实现了 IParser 接口，提供通用的解析流程：
 * 1. 提取 frontmatter
 * 2. 验证 frontmatter
 * 3. 处理内容（Markdown → HTML）
 * 4. 提取元数据
 * 5. 增强 frontmatter
 *
 * @example
 * ```typescript
 * class MyParser extends BaseParser<MyFrontmatter> {
 *   protected type = 'mytype';
 *
 *   validate(data: Record<string, any>): ValidationResult {
 *     // 验证逻辑
 *   }
 *
 *   protected async processFrontmatter(data: Record<string, any>) {
 *     // 增强 frontmatter
 *     return { ...data, foo: 'bar' };
 *   }
 * }
 * ```
 */
export abstract class BaseParser<T> implements IParser<T> {
  /**
   * 解析器类型标识（子类必须实现）
   */
  protected abstract type: string;

  /**
   * 解析 Markdown 文件
   *
   * @param file - Markdown 文件的原始内容
   * @param slug - 内容的唯一标识符
   * @returns 解析结果
   * @throws {ParserValidationError} 当验证失败时抛出
   */
  async parse(file: string, slug: string): Promise<ParseResult<T>> {
    // 1. 提取 frontmatter 和内容
    const { data, content } = matter(file);

    // 2. 验证 frontmatter
    const validation = this.validate(data);

    // 记录警告
    if (validation.warnings.length > 0) {
      console.warn(
        `[${this.type}] 解析警告 (${slug}):\n` +
          validation.warnings.map((w) => `  - ${w.field}: ${w.message}`).join('\n')
      );
    }

    // 检查是否有 critical 错误
    if (!validation.valid) {
      const criticalErrors = validation.errors.filter((e) => e.severity === 'critical');
      if (criticalErrors.length > 0) {
        throw new ParserValidationError(
          `${this.type} 类型验证失败`,
          validation.errors,
          slug
        );
      }
    }

    // 3. 处理内容（Markdown → HTML）
    const processedContent = await this.processContent(content);

    // 4. 增强 frontmatter（子类可重写）
    const enhancedFrontmatter = await this.processFrontmatter(data);

    // 5. 提取元数据
    const metadata = await this.extractMetadata(content, processedContent);

    return {
      frontmatter: enhancedFrontmatter as T,
      content: processedContent,
      slug,
      metadata,
    };
  }

  /**
   * 处理 Markdown 内容
   *
   * 使用统一的 remark 管道将 Markdown 转换为 HTML
   *
   * @param content - Markdown 原始内容
   * @returns HTML 字符串
   */
  protected async processContent(content: string): Promise<string> {
    return RemarkProcessor.process(content);
  }

  /**
   * 提取元数据
   *
   * 自动提取字数、阅读时间、目录等元数据
   * 子类可以重写此方法以添加额外的元数据提取
   *
   * @param rawContent - Markdown 原始内容
   * @param htmlContent - 处理后的 HTML 内容
   * @returns 元数据对象
   */
  protected async extractMetadata(
    rawContent: string,
    htmlContent: string
  ): Promise<ContentMetadata> {
    const baseMetadata = MetadataExtractor.extractAll(rawContent, htmlContent);

    // 允许子类添加额外的元数据
    const additionalMetadata = await this.extractAdditionalMetadata?.(rawContent, htmlContent);

    return {
      ...baseMetadata,
      ...additionalMetadata,
    };
  }

  /**
   * 提取额外的元数据（可选）
   *
   * 子类可以重写此方法以添加特定类型的元数据
   *
   * @param rawContent - Markdown 原始内容
   * @param htmlContent - 处理后的 HTML 内容
   * @returns 额外的元数据对象
   *
   * @example
   * ```typescript
   * protected async extractAdditionalMetadata(rawContent: string, htmlContent: string) {
   *   return {
   *     lineCount: rawContent.split('\n').length,
   *   };
   * }
   * ```
   */
  protected async extractAdditionalMetadata?(
    rawContent: string,
    htmlContent: string
  ): Promise<Partial<ContentMetadata>>;

  /**
   * 处理和增强 frontmatter
   *
   * 子类可以重写此方法以添加默认值、转换数据等
   *
   * @param data - 原始 frontmatter 数据
   * @returns 增强后的 frontmatter 数据
   *
   * @example
   * ```typescript
   * protected async processFrontmatter(data: Record<string, any>) {
   *   return {
   *     ...data,
   *     statusColor: data.statusColor || 'blue', // 默认值
   *   };
   * }
   * ```
   */
  protected async processFrontmatter(
    data: Record<string, any>
  ): Promise<Record<string, any>> {
    return data;
  }

  /**
   * 验证 frontmatter（子类必须实现）
   *
   * @param data - frontmatter 数据
   * @returns 验证结果
   */
  abstract validate(data: Record<string, any>): ValidationResult;

  /**
   * 获取解析器类型
   *
   * @returns 解析器类型字符串
   */
  getType(): string {
    return this.type;
  }

  /**
   * 验证必填字段
   *
   * 辅助方法：验证一组必填字段是否存在
   *
   * @param data - frontmatter 数据
   * @param requiredFields - 必填字段名数组
   * @returns 验证错误列表（如果没有错误则返回空数组）
   *
   * @example
   * ```typescript
   * const errors = this.validateRequiredFields(data, ['title', 'date']);
   * ```
   */
  protected validateRequiredFields(
    data: Record<string, any>,
    requiredFields: string[]
  ): import('./ParserInterface').ValidationError[] {
    const errors: import('./ParserInterface').ValidationError[] = [];

    for (const field of requiredFields) {
      if (!data[field]) {
        errors.push({
          field,
          message: `必填字段 '${field}' 缺失`,
          severity: 'critical',
          value: data[field],
        });
      }
    }

    return errors;
  }

  /**
   * 验证枚举值
   *
   * 辅助方法：验证字段值是否在允许的枚举列表中
   *
   * @param data - frontmatter 数据
   * @param field - 字段名
   * @param allowedValues - 允许的值数组
   * @returns 验证错误（如果验证通过则返回 null）
   *
   * @example
   * ```typescript
   * const error = this.validateEnum(data, 'status', ['draft', 'published']);
   * if (error) errors.push(error);
   * ```
   */
  protected validateEnum<T>(
    data: Record<string, any>,
    field: string,
    allowedValues: T[]
  ): import('./ParserInterface').ValidationError | null {
    const value = data[field];

    if (value !== undefined && !allowedValues.includes(value)) {
      return {
        field,
        message: `'${field}' 必须是以下值之一: ${allowedValues.join(', ')}`,
        severity: 'error',
        value,
      };
    }

    return null;
  }

  /**
   * 验证数组类型
   *
   * 辅助方法：验证字段是否为数组
   *
   * @param data - frontmatter 数据
   * @param field - 字段名
   * @returns 验证错误（如果验证通过则返回 null）
   */
  protected validateArray(
    data: Record<string, any>,
    field: string
  ): import('./ParserInterface').ValidationError | null {
    const value = data[field];

    if (value !== undefined && !Array.isArray(value)) {
      return {
        field,
        message: `'${field}' 必须是数组类型`,
        severity: 'error',
        value,
      };
    }

    return null;
  }

  /**
   * 验证日期格式
   *
   * 辅助方法：验证字段是否为有效的日期字符串
   *
   * @param data - frontmatter 数据
   * @param field - 字段名
   * @returns 验证错误（如果验证通过则返回 null）
   */
  protected validateDate(
    data: Record<string, any>,
    field: string
  ): import('./ParserInterface').ValidationError | null {
    const value = data[field];

    if (value !== undefined && isNaN(Date.parse(value))) {
      return {
        field,
        message: `'${field}' 必须是有效的 ISO 8601 日期格式`,
        severity: 'error',
        value,
      };
    }

    return null;
  }

  /**
   * 验证数字范围
   *
   * 辅助方法：验证数字字段是否在指定范围内
   *
   * @param data - frontmatter 数据
   * @param field - 字段名
   * @param min - 最小值
   * @param max - 最大值
   * @returns 验证错误（如果验证通过则返回 null）
   */
  protected validateNumberRange(
    data: Record<string, any>,
    field: string,
    min: number,
    max: number
  ): import('./ParserInterface').ValidationError | null {
    const value = data[field];

    if (value !== undefined && (typeof value !== 'number' || value < min || value > max)) {
      return {
        field,
        message: `'${field}' 必须是 ${min} 到 ${max} 之间的数字`,
        severity: 'error',
        value,
      };
    }

    return null;
  }
}
