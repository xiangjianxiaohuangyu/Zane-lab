/**
 * 记录相关的展示辅助
 *
 * 封面统一存放在 public/images/records/ 下，不按分类分子目录
 */

import type { RecordFrontmatter } from './types';

/**
 * 记录图片的存放目录（public 下，扁平结构，不按分类分子目录）
 */
const RECORD_IMAGE_BASE = '/images/records/';

/**
 * 拼接记录图片路径
 *
 * @param filename - 图片文件名，相对于 public/images/records/
 * @returns 图片 URL
 */
function toRecordImageUrl(filename: string): string {
  return `${RECORD_IMAGE_BASE}${filename}`;
}

/**
 * 获取封面图路径
 *
 * @param frontmatter - 记录元数据
 * @returns 封面 URL，没有封面时返回 null
 */
export function getRecordCover(frontmatter: RecordFrontmatter): string | null {
  if (!frontmatter.cover) return null;

  return toRecordImageUrl(frontmatter.cover);
}

/**
 * 获取图集图片路径列表
 *
 * 返回可直接用于 <img src> 的 URL 数组，过滤掉空项
 *
 * @param frontmatter - 记录元数据
 * @returns 图集 URL 数组，没有图集时返回空数组
 */
export function getRecordImages(frontmatter: RecordFrontmatter): string[] {
  const images = frontmatter.images;
  if (!Array.isArray(images)) return [];

  return images
    .filter((name): name is string => typeof name === 'string' && name.trim() !== '')
    .map(toRecordImageUrl);
}

/**
 * 获取创作者名字
 *
 * @param frontmatter - 记录元数据
 * @returns 创作者名字，没有填写 name 时返回 null
 */
export function getRecordName(frontmatter: RecordFrontmatter): string | null {
  return frontmatter.name ?? null;
}

/**
 * 格式化评分
 *
 * 固定保留 1 位小数，9 显示为 9.0，10 显示为 10.0
 *
 * @param rating - 原始评分
 * @returns 1 位小数的评分文本
 */
export function formatRating(rating: number): string {
  return rating.toFixed(1);
}