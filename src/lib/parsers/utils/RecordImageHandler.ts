/**
 * 记录正文图片处理器
 *
 * 仅作用于「记录」内容的 Markdown 图片节点，为其注入可点击 / 可聚焦的标记，
 * 便于详情页通过事件委托打开灯箱。
 *
 * 其他内容类型（写作、项目）共用默认的图片处理逻辑，
 * 它们的图片不可点开，避免出现误导性的交互暗示。
 */

import type { ImageHandler } from './RemarkProcessor';

/**
 * 创建记录正文专用的图片处理器
 *
 * 在 remark 默认实现的基础上追加：
 * - loading="lazy"：延迟加载，避免首屏一次性请求全部图片
 * - tabindex="0"：使图片可被键盘聚焦
 * - role="button"：向屏幕阅读器表明该元素可激活
 * - aria-label：alt 为空时补一个可访问名称
 *
 * @returns 图片节点处理器
 */
export function createRecordImageHandler(): ImageHandler {
  return function recordImageHandler(state, node) {
    const alt = typeof node.alt === 'string' ? node.alt : '';

    // hast 属性名用驼峰，写成 HTML 属性时会自动转小写（tabIndex → tabindex）
    const properties = {
      src: node.url,
      alt,
      loading: 'lazy',
      tabIndex: 0,
      role: 'button',
      ...(node.title ? { title: node.title } : {}),
      ...(alt ? {} : { ariaLabel: '查看图片' }),
    };

    const result = {
      type: 'element' as const,
      tagName: 'img',
      properties,
      children: [],
    };

    state.patch(node, result);
    return state.applyData(node, result);
  };
}
