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

  console.log('Found project modules:', Object.keys(projectModules));
  console.log('Number of modules:', Object.keys(projectModules).length);

  if (Object.keys(projectModules).length === 0) {
    console.warn('No project files found!');
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
        console.error(`Error parsing project ${path}:`, error);
        throw error;
      }
    })
  );

  console.log('Parsed projects:', projects);

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
        console.error(`Error parsing writing ${path}:`, error);
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
 * 从 content/records/ 目录及其子目录加载所有 .md 文件
 * 按日期降序排列（最新的在前）
 *
 * @returns 记录内容数组
 */
async function loadRecords(): Promise<Content<RecordFrontmatter>[]> {
  // 递归加载所有记录文件（包括子目录）
  const recordModules = import.meta.glob('../../content/records/**/*.md', {
    query: '?raw',
    import: 'default',
  });

  // 创建记录解析器
  const recordParser = new RecordParser();

  // 解析所有记录文件
  const records = await Promise.all(
    Object.entries(recordModules).map(async ([path, loader]) => {
      try {
        const file = await (loader as () => Promise<string>)() as string;
        const slug = extractSlug(path);

        // 使用新的记录解析器
        const parsed = await recordParser.parse(file, slug);

        return {
          frontmatter: parsed.frontmatter,
          content: parsed.content,
          slug,
          metadata: parsed.metadata,
        } as Content<RecordFrontmatter>;
      } catch (error) {
        console.error(`Error parsing record ${path}:`, error);
        throw error;
      }
    })
  );

  // 按日期降序排列
  return records.sort(
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
 * 内容导出对象（初始为空）
 *
 * 在应用启动时异步加载
 */
let cachedContent: {
  projects: Content<ProjectFrontmatter>[];
  writing: Content<WritingFrontmatter>[];
  records: Content<RecordFrontmatter>[];
} | null = null;

/**
 * 获取内容（带缓存）
 *
 * 首次调用时加载内容，后续调用返回缓存
 */
export async function getContent() {
  if (!cachedContent) {
    cachedContent = await loadAllContent();
  }
  return cachedContent;
}

// 为了向后兼容，导出一个同步的 content 对象
// 注意：初始值为空数组，需要先调用 getContent()
export const content = {
  projects: [] as Content<ProjectFrontmatter>[],
  writing: [] as Content<WritingFrontmatter>[],
  records: [] as Content<RecordFrontmatter>[],
};

// 在模块加载时自动初始化（仅在支持的环境中）
if (typeof window !== 'undefined') {
  getContent().then((data) => {
    content.projects = data.projects;
    content.writing = data.writing;
    content.records = data.records;
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
 * 根据分类筛选记录内容
 *
 * @param category - 记录分类 (movie | book | game | music)
 * @returns 该分类下的所有记录内容
 */
export function getRecordsByCategory(
  category: 'movie' | 'book' | 'game' | 'music'
): Content<RecordFrontmatter>[] {
  return content.records.filter((r) => r.frontmatter.category === category);
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
