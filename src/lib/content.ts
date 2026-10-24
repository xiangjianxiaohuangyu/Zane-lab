/**
 * 内容加载系统
 *
 * 使用 Vite 的 import.meta.glob() 在构建时加载所有 Markdown 文件
 * 这是整个项目的核心，实现了"内容即文件"的架构原则
 *
 * 重构说明：现在使用专门的解析器来处理不同类型的内容
 */

import type {
  ProjectFrontmatter,
  WritingFrontmatter,
  RecordFrontmatter,
  Content,
} from './types';
import { extractSlug } from './markdown';
import { ProjectParser } from './parsers';
import { WritingParser } from './parsers';
import { RecordParser } from './parsers';

/**
 * 加载所有项目内容
 *
 * 从 content/projects/ 目录加载所有 .md 文件
 * 按日期降序排列（最新的在前）
 *
 * @returns 项目内容数组
 */
async function loadProjects(): Promise<Content<ProjectFrontmatter>[]> {
  // 使用 Vite 的 glob import 导入所有项目文件
  // ?raw 表示导入原始字符串内容
  // 路径相对于当前文件：src/lib/content.ts -> content/projects/
  const projectModules = import.meta.glob('../../content/projects/*.md', {
    query: '?raw',
    import: 'default',
  });

  if (Object.keys(projectModules).length === 0) {
    return [];
  }

  // 创建项目解析器
  const projectParser = new ProjectParser();

  // 解析所有项目文件
  const projects = await Promise.all(
    Object.entries(projectModules).map(async ([path, loader]) => {
      try {
        // 加载文件内容
        const file = await (loader as () => Promise<string>)();

        // 从文件路径提取 slug
        const slug = extractSlug(path);

        // 使用新的解析器解析
        const parsed = await projectParser.parse(file, slug);

        return {
          frontmatter: parsed.frontmatter,
          content: parsed.content,
          slug,
          metadata: parsed.metadata,
        } as Content<ProjectFrontmatter>;
      } catch (error) {
        throw error;
      }
    })
  );

  // 按日期降序排列（最新的在前）
  return projects.sort(
    (a, b) =>
      new Date(b.frontmatter.date).getTime() -
      new Date(a.frontmatter.date).getTime()
  );
}

/**
 * 加载所有写作内容
 *
 * 从 content/writing/ 目录及其子目录加载所有 .md 文件
 * 根据文件夹路径自动分配分类：
 * - essays/ -> essay (随笔)
 * - fiction/ -> fiction (小说)
 * - annual/ -> annual (年度总结)
 * - poetry/ -> poetry (诗歌)
 * 按日期降序排列（最新的在前）
 *
 * @returns 写作内容数组
 */
async function loadWriting(): Promise<Content<WritingFrontmatter>[]> {
  // 递归加载所有写作文件（包括子目录）
  const writingModules = import.meta.glob('../../content/writing/**/*.md', {
    query: '?raw',
    import: 'default',
  });

  // 创建写作解析器
  const writingParser = new WritingParser();

  // 解析所有写作文件
  const writings = await Promise.all(
    Object.entries(writingModules).map(async ([path, loader]) => {
      try {
        const file = await (loader as () => Promise<string>)() as string;
        const slug = extractSlug(path);

        // 使用新的写作解析器（会自动检测 category）
        const parsed = await writingParser.parse(file, slug, path);

        return {
          frontmatter: parsed.frontmatter,
          content: parsed.content,
          slug,
          metadata: parsed.metadata,
        } as Content<WritingFrontmatter>;
      } catch (error) {
        throw error;
      }
    })
  );

  // 按日期降序排列
  return writings.sort(
    (a, b) =>
      new Date(b.frontmatter.date).getTime() -
      new Date(a.frontmatter.date).getTime()
  );
}

/**
 * 加载所有记录内容
 *
 * 从 content/records/ 加载所有 .md 文件
 * 一个文件 = 一条记录，记录属于哪一类由 frontmatter 的 category 字段决定
 * 按日期降序排列（最新的在前）
 *
 * @returns 记录内容数组
 */
async function loadRecords(): Promise<Content<RecordFrontmatter>[]> {
  // 加载所有记录文件
  const recordModules = import.meta.glob('../../content/records/*.md', {
    query: '?raw',
    import: 'default',
  });

  // 创建记录解析器
  const recordParser = new RecordParser();

  // 解析所有记录文件
  const parsed = await Promise.all(
    Object.entries(recordModules).map(async ([path, loader]) => {
      // slug 取自文件名，如 in-the-mood-for-love
      const slug = extractSlug(path);

      try {
        const file = await (loader as () => Promise<string>)();

        const result = await recordParser.parse(file, slug);

        return {
          frontmatter: result.frontmatter,
          content: result.content,
          slug,
          metadata: result.metadata,
        } as Content<RecordFrontmatter>;
      } catch (error) {
        // 记录错误但继续处理其他文件
        console.error(`[loadRecords] Failed to parse ${path}:`, error);
        return null;
      }
    })
  );

  const allRecords = parsed.filter(
    (record): record is Content<RecordFrontmatter> => record !== null
  );

  console.log(`[loadRecords] Total records loaded: ${allRecords.length}`);

  // 按日期降序排列（最新的在最前）
  return allRecords.sort(
    (a, b) =>
      new Date(b.frontmatter.date).getTime() -
      new Date(a.frontmatter.date).getTime()
  );
}

/**
 * 加载所有内容
 *
 * 异步加载所有类型的内容
 *
 * @returns 包含所有内容的对象
 *
 * @example
 * ```typescript
 * import { loadAllContent } from '@/lib/content';
 *
 * // 在组件中加载内容
 * const [content, setContent] = useState(null);
 *
 * useEffect(() => {
 *   loadAllContent().then(setContent);
 * }, []);
 *
 * // 获取所有项目
 * const projects = content?.projects;
 * ```
 */
export async function loadAllContent() {
  const [projects, writing, records] = await Promise.all([
    loadProjects(),
    loadWriting(),
    loadRecords(),
  ]);

  return {
    projects,
    writing,
    records,
  };
}

/**
 * 全量内容
 */
type ContentBundle = {
  projects: Content<ProjectFrontmatter>[];
  writing: Content<WritingFrontmatter>[];
  records: Content<RecordFrontmatter>[];
};

/**
 * 内容缓存
 *
 * 在应用启动时异步加载
 */
let cachedContent: ContentBundle | null = null;

/**
 * 进行中的加载任务
 *
 * 避免并发调用重复发起同一批加载
 */
let pendingLoad: Promise<ContentBundle> | null = null;

// 为了向后兼容，导出一个同步的 content 对象
// 注意：初始值为空数组，getContent() 完成后才会被填充
export const content = {
  projects: [] as Content<ProjectFrontmatter>[],
  writing: [] as Content<WritingFrontmatter>[],
  records: [] as Content<RecordFrontmatter>[],
};

/**
 * 获取内容（带缓存）
 *
 * 首次调用时加载内容，后续调用返回缓存。
 * 同步的 content 对象在返回前就会被填充，
 * 这样调用方拿到结果时 getContentBySlug 之类的同步查询一定能查到。
 */
export async function getContent() {
  if (cachedContent) {
    return cachedContent;
  }

  pendingLoad ??= loadAllContent().then((data) => {
    cachedContent = data;
    content.projects = data.projects;
    content.writing = data.writing;
    content.records = data.records;
    return data;
  });

  try {
    return await pendingLoad;
  } catch (error) {
    // 加载失败时清掉 pendingLoad，允许下次重试
    pendingLoad = null;
    throw error;
  }
}

// 在模块加载时自动初始化（仅在支持的环境中）
if (typeof window !== 'undefined') {
  getContent().catch((error) => {
    console.error('[content] 预加载失败:', error);
  });
}

/**
 * 根据分类筛选写作内容
 *
 * @param category - 写作分类 (essay | annual | fiction | poetry)
 * @returns 该分类下的所有写作内容
 */
export function getWritingByCategory(
  category: 'essay' | 'annual' | 'fiction' | 'poetry'
): Content<WritingFrontmatter>[] {
  return content.writing.filter((w) => w.frontmatter.category === category);
}

/**
 * 根据 slug 获取项目
 *
 * @param slug - 项目的唯一标识符
 * @returns 匹配的项目内容，如果未找到则返回 undefined
 */
export function getProjectBySlug(
  slug: string
): Content<ProjectFrontmatter> | undefined {
  return content.projects.find((p) => p.slug === slug);
}

/**
 * 根据 slug 获取写作
 *
 * @param slug - 写作的唯一标识符
 * @returns 匹配的写作内容，如果未找到则返回 undefined
 */
export function getWritingBySlug(
  slug: string
): Content<WritingFrontmatter> | undefined {
  return content.writing.find((w) => w.slug === slug);
}

/**
 * 根据 slug 获取记录
 *
 * @param slug - 记录的唯一标识符
 * @returns 匹配的记录内容，如果未找到则返回 undefined
 */
export function getRecordBySlug(
  slug: string
): Content<RecordFrontmatter> | undefined {
  return content.records.find((r) => r.slug === slug);
}
