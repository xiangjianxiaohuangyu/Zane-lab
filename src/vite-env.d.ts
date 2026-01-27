/**
 * Vite 环境类型声明
 *
 * 扩展 import.meta 以支持 Vite 特性
 */

/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE?: string;
  // 可以在这里添加更多的环境变量
}

interface ImportMeta {
  readonly env: ImportMetaEnv;

  /**
   * Vite 的 glob 导入功能
   * 用于在构建时动态导入多个模块
   */
  glob(
    pattern: string,
    options?: {
      /**
       * 查询参数
       * ?raw: 导入原始内容
       * ?url: 导入 URL
       * ?inline: 内联导入
       */
      query?: string;
      /**
       * 导入的内容
       * 'default': 默认导出
       */
      import?: 'default' | string;
      /**
       * 是否断言导入
       */
      assert?: { type: string };
    }
  ): Record<string, () => Promise<any>>;

  /**
   * Vite 的 glob 导入功能（同步版本）
   * 返回已解析的模块
   */
  globEager(
    pattern: string,
    options?: {
      query?: string;
      import?: 'default' | string;
      assert?: { type: string };
    }
  ): Record<string, any>;
}
