import type { TocItem } from './toc';

/**
 * 项目 Frontmatter 类型定义
 *
 * 用于项目展示页面的元数据
 */
export interface ProjectFrontmatter {
  /** 项目标题（中文） */
  title: string;

  /** 项目英文标题 */
  englishTitle: string;

  /** 项目简述 */
  description: string;

  /** 创建日期（ISO 8601 格式） */
  date: string;

  /** 技术标签列表 */
  tags: string[];

  /** 项目配图路径（可选） */
  image?: string;

  /** 项目链接（可选） */
  link?: string;

  /** 项目状态 */
  status: 'completed' | 'in-progress' | 'planned';

  /** 状态标签颜色（可选） red | white | green | blue */
  statusColor?: 'red' | 'white' | 'green' | 'blue';

  /** 版本号（可选） */
  version?: string;
}

/**
 * 写作 Frontmatter 类型定义
 *
 * 用于写作内容（随笔、年终总结、小说、诗歌）的元数据
 */
export interface WritingFrontmatter {
  /** 文章标题 */
  title: string;

  /** 文章简介 */
  description: string;

  /** 发布日期（ISO 8601 格式） */
  date: string;

  /** 写作分类 */
  category: 'essay' | 'annual' | 'fiction' | 'poetry';

  /** 标签列表 */
  tags?: string[];

  /** 年终总结年份（仅 annual 类型使用） */
  years?: string;

  /** 字数统计（可选） */
  wordCount?: number;

  /** 预计阅读时长（分钟，可选） */
  readTime?: number;

  /** 是否显示左侧目录导航（默认 false） */
  showToc?: boolean;

  /** 标签状态颜色（可选）：blue, green, white, pink 等 */
  statusColor?: 'blue' | 'green' | 'white' | 'pink' | 'default' | 'primary' | 'success' | 'warning' | 'danger';
}

/**
 * 记录 Frontmatter 类型定义
 *
 * 用于个人记录（电影、书籍、游戏、音乐）的元数据
 */
export interface RecordFrontmatter {
  /** 作品名称 */
  title: string;

  /** 记录分类 */
  category: 'movie' | 'book' | 'game' | 'music';

  /** 记录日期（ISO 8601 格式） */
  date: string;

  /** 个人评分（1-10，可选） */
  rating?: number;

  /** 标签列表 */
  tags: string[];

  /** 封面图片路径（可选） */
  cover?: string;

  /** 作者（书籍专用，可选） */
  author?: string;

  /** 开发商（游戏专用，可选） */
  developer?: string;

  /** 艺术家（音乐专用，可选） */
  artist?: string;

  /** 导演（电影专用，可选） */
  director?: string;

  /** 个人感想（可选） */
  notes?: string;
}

/**
 * 通用内容类型
 *
 * 泛型 T 表示 Frontmatter 的类型
 */
export interface Content<T> {
  /** Frontmatter 元数据 */
  frontmatter: T;

  /** Markdown 转换后的 HTML 内容 */
  content: string;

  /** 内容的唯一标识符（从文件名派生） */
  slug: string;

  /** 自动提取的元数据（可选） */
  metadata?: ContentMetadata;
}

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

  /** 诗歌行数（poetry 专属） */
  lineCount?: number;

  /** 诗节数（poetry 专属） */
  stanzaCount?: number;

  /** 扩展字段（允许特定类型添加额外元数据） */
  [key: string]: any;
}

/**
 * 写作分类映射
 * 用于显示分类的中文名称
 */
export const WRITING_CATEGORY_MAP: Record<string, string> = {
  essay: '随笔',
  annual: '年终总结',
  fiction: '小说',
  poetry: '诗歌',
};

/**
 * 记录分类映射
 * 用于显示分类的中文名称
 */
export const RECORD_CATEGORY_MAP: Record<string, string> = {
  movie: '电影',
  book: '书籍',
  game: '游戏',
  music: '音乐',
};

/**
 * 项目状态映射
 * 用于显示项目状态的中文名称和颜色
 */
export const PROJECT_STATUS_MAP: Record<string, { label: string; color: string }> = {
  completed: { label: '已完成', color: 'text-green-400' },
  'in-progress': { label: '进行中', color: 'text-yellow-400' },
  planned: { label: '计划中', color: 'text-gray-400' },
};

/**
 * 影史十佳 Frontmatter 类型定义
 *
 * 用于影史十佳榜单的元数据
 */
export interface Top10MovieFrontmatter {
  /** 排名编号 (1-10) */
  num: number;

  /** 电影名称（用于从 movies.md 索引） */
  name: string;
}

/**
 * 影史十佳条目类型
 *
 * 包含排名信息和完整的电影信息
 */
export interface Top10MovieEntry {
  /** 排名编号 */
  num: number;

  /** 电影名称 */
  name: string;

  /** 完整的电影记录信息 */
  movie: Content<RecordFrontmatter>;
}

/**
 * 心目中的十佳游戏 Frontmatter 类型定义
 *
 * 用于心目中的十佳游戏榜单的元数据
 */
export interface Top10GameFrontmatter {
  /** 排名编号 (1-10) */
  num: number;

  /** 游戏名称（用于从 games.md 索引） */
  name: string;
}

/**
 * 心目中的十佳游戏条目类型
 *
 * 包含排名信息和完整的游戏信息
 */
export interface Top10GameEntry {
  /** 排名编号 */
  num: number;

  /** 游戏名称 */
  name: string;

  /** 完整的游戏记录信息 */
  game: Content<RecordFrontmatter>;
}
