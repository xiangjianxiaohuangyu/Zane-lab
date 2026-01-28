
/**
 * Markdown 渲染样式变体
 */
export type MarkdownStyle = 'default' | 'writing' | 'project' | 'poetry';

/**
 * 样式配置映射
 */
const STYLE_CONFIGS: Record<MarkdownStyle, string> = {
  default: '', // 保持当前默认样式

  // Writing 样式：文学性内容，注重阅读体验
  writing: `
        /* 标题样式 - <h1>-<h6> */
        prose-headings:font-bold       /* 标题字重：粗体 */
        prose-headings:text-text-primary  /* 标题颜色 */
        prose-headings:mt-6             /* 标题上边距 */
        prose-headings:mb-3             /* 标题下边距 */
        prose-headings:leading-tight     /* 标题行高：紧凑 */
        prose-h1:text-3xl               /* 一级标题：30px */
        prose-h1:mt-0                   /* 一级标题上边距：0 */
        prose-h1:mb-5                   /* 一级标题下边距 */
        prose-h1:tracking-tight         /* 一级标题字间距：紧凑 */

        /* 段落样式 - <p> */
        prose-p:indent-8                 /* 段落首行缩进：2rem */
        prose-p:mb-6                     /* 段落下边距 */
        prose-p:text-lg                 /* 段落字体：18px */
        prose-p:text-text-secondary     /* 段落颜色：次要文字色 */
        prose-p:leading-loose     /* 行间距：1.25，紧凑 */
        
        

  `,

  // Project 样式：技术性内容，信息密度高
  project: `
    /* 段落样式 - <p> */
    prose
        prose-invert
        max-w-none

        /* 标题样式 - <h1>-<h6> */
        prose-headings:font-bold       /* 标题字重：粗体 */
        prose-headings:text-text-primary  /* 标题颜色 */
        prose-headings:mt-6             /* 标题上边距 */
        prose-headings:mb-3             /* 标题下边距 */
        prose-headings:leading-tight     /* 标题行高：紧凑 */
        prose-h1:text-3xl               /* 一级标题：30px */
        prose-h1:mt-0                   /* 一级标题上边距：0 */
        prose-h1:mb-5                   /* 一级标题下边距 */
        prose-h1:tracking-tight         /* 一级标题字间距：紧凑 */
        prose-h2:text-2xl               /* 二级标题：24px */
        prose-h2:mt-8                   /* 二级标题上边距 */
        prose-h2:mb-4                   /* 二级标题下边距 */
        prose-h2:pb-2                   /* 二级标题下内边距 */
        prose-h2:border-b               /* 二级标题底部边框 */
        prose-h2:border-glass-200      /* 边框颜色 */
        prose-h2:tracking-tight         /* 二级标题字间距 */
        prose-h3:text-xl                /* 三级标题：20px */
        prose-h3:mt-6                   /* 三级标题上边距 */
        prose-h3:mb-3                   /* 三级标题下边距 */
        prose-h4:text-lg                /* 四级标题：18px */
        prose-h4:mt-5                   /* 四级标题上边距 */
        prose-h4:mb-3                   /* 四级标题下边距 */
        prose-h5:text-base              /* 五级标题：16px */
        prose-h6:text-sm                /* 六级标题：14px */


        /* 段落样式 - <p> */
        prose-p:indent-8                 /* 段落首行缩进：2rem */
        prose-p:mb-6                     /* 段落下边距 */
        prose-p:text-lg                 /* 段落字体：18px */
        prose-p:text-text-secondary     /* 段落颜色：次要文字色 */
        prose-p:leading-normal   /* 行间距：1.5，正常 */


        /* 列表样式 - <ul>/<ol>/<li> */
        prose-ul:mb-4                    /* 无序列表下边距 */
        prose-ul:ml-4                    /* 无序列表左边距 */
        prose-ul:space-y-2               /* 无序列表项间距 */
        prose-ol:mb-4                    /* 有序列表下边距 */
        prose-ol:ml-4                    /* 有序列表左边距 */
        prose-li:marker:text-text-secondary  /* 列表标记颜色 */
        prose-li:text-indent-0          /* 列表项文本不缩进 */
        prose-li:p:indent-0             /* 列表项段落不缩进 */


        /* 链接样式 - <a> */
        prose-a:text-primary            /* 链接颜色：主题色 */
        prose-a:no-underline            /* 链接无下划线 */
        prose-a:font-medium             /* 链接字重：中等 */
        hover:prose-a:underline         /* 悬停时显示下划线 */
        hover:prose-a:text-primary-light /* 悬停时颜色变浅 */


        /* 粗体和斜体 - <strong>/<em> */
        prose-strong:text-text-primary  /* 粗体颜色 */
        prose-strong:font-semibold      /* 粗体字重 */
        prose-em:text-text-secondary    /* 斜体颜色 */


        /* 行内代码 - <code> */
        prose-code:text-primary         /* 代码颜色 */
        prose-code:bg-glass-100         /* 代码背景色 */
        prose-code:px-1.5               /* 代码左右内边距 */
        prose-code:py-0.5               /* 代码上下内边距 */
        prose-code:rounded              /* 代码圆角 */
        prose-code:text-sm              /* 代码字体大小 */
        prose-code:font-mono            /* 代码等宽字体 */


        /* 代码块 - <pre> */
        prose-pre:bg-background-secondary  /* 代码块背景 */
        prose-pre:border                 /* 代码块边框 */
        prose-pre:border-glass-200      /* 边框颜色 */
        prose-pre:rounded-lg            /* 代码块圆角 */
        prose-pre:p-4                    /* 代码块内边距 */
        prose-pre:mb-4                   /* 代码块下边距 */
        prose-pre:mt-4                   /* 代码块上边距 */
        prose-pre:shadow-sm              /* 代码块阴影 */


        /* 引用块 - <blockquote> */
        prose-blockquote:border-l-4      /* 引用左侧边框 */
        prose-blockquote:border-glass-300 /* 边框颜色 */
        prose-blockquote:bg-glass-50     /* 背景色 */
        prose-blockquote:py-2            /* 上下内边距 */
        prose-blockquote:px-4            /* 左右内边距 */
        prose-blockquote:my-4            /* 上下外边距 */
        prose-blockquote:text-text-secondary  /* 文字颜色 */
        prose-blockquote:italic          /* 斜体 */


        /* 分隔线 - <hr> */
        prose-hr:border-glass-200        /* 分隔线颜色 */
        prose-hr:my-8                    /* 上下外边距 */


        /* 图片 - <img> */
        prose-img:rounded-lg             /* 图片圆角 */
        prose-img:shadow-lg              /* 图片阴影 */
        prose-img:my-6                   /* 上下外边距 */


        /* 表格 - <table>/<th>/<td> */
        prose-th:text-text-primary       /* 表头颜色 */
        prose-th:font-semibold           /* 表头字重 */
        prose-th:border-glass-200       /* 表头边框 */
        prose-th:bg-glass-50             /* 表头背景 */
        prose-th:px-4                    /* 表头左右内边距 */
        prose-th:py-2                    /* 表头上下内边距 */
        prose-td:border-glass-200       /* 单元格边框 */
        prose-td:px-4                    /* 单元格左右内边距 */
        prose-td:py-2                    /* 单元格上下内边距 */
        prose-tr:border-glass-200       /* 行边框 */


        

    
    

  `,

  // Poetry 样式：诗集，居中显示
  poetry: `
        /* 标题样式 - <h1>-<h6> */
        prose-headings:text-center /* 所有标题居中 ⭐ */
        prose-headings:font-bold       /* 标题字重：粗体 */
        prose-headings:text-text-primary  /* 标题颜色 */
        prose-headings:mt-2             /* 标题上边距 */
        prose-headings:leading-none     /* 标题行高：紧凑 */
        prose-h1:text-2xl               /* 一级标题：30px */
        prose-h1:text-center    /* 一级标题居中 */
        prose-h1:mt-4                   /* 一级标题上边距：0 */
        prose-h1:mb-4                  /* 一级标题下边距 */
        prose-h1:tracking-tight         /* 一级标题字间距：紧凑 */

        /* 段落样式 - <p> */
        prose-p:text-lg                 /* 段落字体：18px */
        prose-p:text-text-secondary     /* 段落颜色：次要文字色 */
        prose-p:text-center     /* 文字居中对齐 ⭐ */
        prose-p:text-text-primary /* 文字颜色：主要文字色 */
        prose-p:leading-loose     /* 行间距：1.25，紧凑 */

       
  `,
};

/**
 * MarkdownRenderer 组件属性
 */
interface MarkdownRendererProps {
  /** Markdown 转换后的 HTML 内容 */
  content: string;

  /** 自定义类名（可选） */
  className?: string;

  /** 样式变体（可选） */
  style?: MarkdownStyle;
}

/**
 * Markdown 渲染器组件
 *
 * 用于渲染从 Markdown 转换而来的 HTML 内容
 * 提供优雅的排版样式，支持不同样式变体
 *
 * @example
 * ```tsx
 * // 默认样式
 * <MarkdownRenderer content="<h1>标题</h1><p>段落</p>" />
 *
 * // 写作样式
 * <MarkdownRenderer content="<h1>标题</h1><p>段落</p>" style="writing" />
 *
 * // 项目样式
 * <MarkdownRenderer content="<h1>标题</h1><p>段落</p>" style="project" />
 * ```
 */
export function MarkdownRenderer({
  content,
  className = '',
  style = 'default'
}: MarkdownRendererProps) {
  // 获取变体样式
  const variantStyles = STYLE_CONFIGS[style] || '';

  return (
    <div
      className={`
        /* 自定义类名 */
        ${className}
        /* 样式变体（放在最后以覆盖默认样式） */
        ${variantStyles}
      `.trim().replace(/\s+/g, ' ')}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
