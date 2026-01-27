/**
 * 日期格式化工具
 *
 * 支持多种日期格式的智能显示
 */

/**
 * 格式化日期字符串
 *
 * 根据输入的日期格式智能显示：
 * - 完整日期 (2025-01-27) → "2025年1月27日"
 * - 年月 (2025-01) → "2025年1月"
 * - 年 (2025) → "2025年"
 *
 * @param dateString - 日期字符串，支持 ISO 8601 格式
 * @returns 格式化后的中文字符串
 *
 * @example
 * ```typescript
 * formatDate("2025-01-27") // "2025年1月27日"
 * formatDate("2025-01")    // "2025年1月"
 * formatDate("2025")       // "2025年"
 * ```
 */
export function formatDate(dateString: string): string {
  const parts = dateString.split('-');
  const date = new Date(dateString);

  // 根据日期格式返回不同的显示格式
  if (parts.length === 3) {
    // 完整日期：年-月-日
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } else if (parts.length === 2) {
    // 年-月
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
    });
  } else {
    // 只有年
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
    });
  }
}
