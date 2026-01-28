/**
 * 自定义验证错误类
 *
 * 用于解析过程中的错误处理
 */

import type { ValidationError } from './ParserInterface';

/**
 * 解析验证错误类
 *
 * 当解析过程中出现 critical 级别的验证错误时抛出
 */
export class ParserValidationError extends Error {
  /** 错误列表 */
  public readonly errors: readonly ValidationError[];

  /** 文件路径（可选） */
  public readonly file?: string;

  /**
   * 创建验证错误实例
   *
   * @param message - 错误消息
   * @param errors - 验证错误列表
   * @param file - 文件路径（可选）
   */
  constructor(
    message: string,
    errors: ValidationError[],
    file?: string
  ) {
    super(message);
    this.name = 'ParserValidationError';
    this.errors = errors;
    this.file = file;

    // 维护正确的原型链
    Object.setPrototypeOf(this, ParserValidationError.prototype);
  }

  /**
   * 格式化错误信息用于显示
   *
   * @returns 格式化后的错误字符串
   */
  format(): string {
    let output = this.message;

    if (this.file) {
      output += `\n文件: ${this.file}`;
    }

    output += '\n\n错误详情:\n';
    output += this.errors
      .map((e) => `  ❌ ${e.field}: ${e.message}${e.value ? ` (当前值: ${e.value})` : ''}`)
      .join('\n');

    return output;
  }

  /**
   * 获取 critical 级别的错误
   *
   * @returns critical 错误列表
   */
  getCriticalErrors(): ValidationError[] {
    return this.errors.filter((e) => e.severity === 'critical');
  }

  /**
   * 获取 error 级别的错误
   *
   * @returns error 错误列表
   */
  getErrors(): ValidationError[] {
    return this.errors.filter((e) => e.severity === 'error');
  }

  /**
   * 转换为纯对象
   *
   * @returns 错误信息的对象表示
   */
  toJSON(): any {
    return {
      name: this.name,
      message: this.message,
      file: this.file,
      errors: this.errors,
    };
  }
}

/**
 * 创建验证错误的辅助函数
 *
 * @param field - 字段名
 * @param message - 错误消息
 * @param severity - 严重程度
 * @param value - 当前值（可选）
 * @returns 验证错误对象
 */
export function createValidationError(
  field: string,
  message: string,
  severity: 'critical' | 'error' = 'error',
  value?: any
): ValidationError {
  return {
    field,
    message,
    severity,
    value,
  };
}

/**
 * 创建验证警告的辅助函数
 *
 * @param field - 字段名
 * @param message - 警告消息
 * @param suggestion - 建议修改方案（可选）
 * @returns 验证警告对象
 */
export function createValidationWarning(
  field: string,
  message: string,
  suggestion?: string
): import('./ParserInterface').ValidationWarning {
  return {
    field,
    message,
    suggestion,
  };
}
