/**
 * 解析器核心接口定义
 *
 * 定义了所有解析器必须遵循的契约
 */

import type { TocItem } from '../../toc';

/**
 * 内容元数据接口
 *
 * 包含自动提取的元数据信息
 */
export interface ContentMetadata {
  /** 字数统计（中英文混合） */
  wordCount?: number;

  /** 阅读时间（分钟） */
  readTime?: number;

  /** 目录结构 */
  toc?: TocItem[];

  /** 扩展字段（允许特定类型添加额外元数据） */
  [key: string]: any;
}

/**
 * 解析结果接口
 *
 * 泛型 T 表示 Frontmatter 的类型
 */
export interface ParseResult<T> {
  /** 解析后的 frontmatter */
  frontmatter: T;

  /** Markdown 转换后的 HTML 内容 */
  content: string;

  /** 内容的唯一标识符（从文件名派生） */
  slug: string;

  /** 自动提取的元数据 */
  metadata?: ContentMetadata;
}

/**
 * 验证错误接口
 */
export interface ValidationError {
  /** 字段名 */
  field: string;

  /** 错误信息 */
  message: string;

  /** 严重程度 */
  severity: 'critical' | 'error';

  /** 当前值（可选，用于错误提示） */
  value?: any;
}

/**
 * 验证警告接口
 */
export interface ValidationWarning {
  /** 字段名 */
  field: string;

  /** 警告信息 */
  message: string;

  /** 建议修改方案（可选） */
  suggestion?: string;
}

/**
 * 验证结果接口
 */
export interface ValidationResult {
  /** 是否通过验证（critical 错误会导致验证失败） */
  valid: boolean;

  /** 错误列表 */
  errors: ValidationError[];

  /** 警告列表 */
  warnings: ValidationWarning[];
}

/**
 * 基础解析器接口
 *
 * 所有解析器必须实现此接口
 */
export interface IParser<T> {
  /**
   * 解析 Markdown 内容
   *
   * @param file - Markdown 文件的原始内容（字符串）
   * @param slug - 内容的唯一标识符
   * @returns 解析结果
   */
  parse(file: string, slug: string): Promise<ParseResult<T>>;

  /**
   * 验证 frontmatter 数据
   *
   * @param data - 从 Markdown 中提取的 frontmatter 对象
   * @returns 验证结果
   */
  validate(data: Record<string, any>): ValidationResult;

  /**
   * 获取解析器类型标识
   *
   * @returns 解析器类型字符串（如 'project', 'writing', 'record'）
   */
  getType(): string;
}

/**
 * Category 专属解析器接口
 *
 * 用于 writing 类型的 category 专属解析
 */
export interface ICategoryParser<T> extends IParser<T> {
  /**
   * 获取支持的 category
   *
   * @returns category 字符串（如 'essay', 'poetry'）
   */
  getCategory(): string;

  /**
   * 处理 category 特定的逻辑
   *
   * @param data - frontmatter 数据
   * @param content - Markdown 原始内容
   * @returns category 专属的额外数据或元数据
   */
  processCategorySpecific(data: any, content: string): Promise<any>;
}
