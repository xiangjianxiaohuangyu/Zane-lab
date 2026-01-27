import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// https://vitejs.dev/config/
export default defineConfig({
  // 插件配置
  plugins: [
    react(),
    nodePolyfills({
      // 添加 Buffer 和 global polyfill
      globals: {
        Buffer: true,
        global: true,
      },
    }),
  ],

  // 路径解析配置
  resolve: {
    // 配置路径别名
    alias: {
      // @ 映射到 src 目录，方便导入：@/components/Header
      '@': path.resolve(__dirname, './src'),
    },
  },

  // 开发服务器配置
  server: {
    // 开发服务器端口
    port: 3000,

    // 自动打开浏览器
    open: true,
  },

  // 构建配置
  build: {
    // 输出目录
    outDir: 'dist',

    // 资源目录
    assetsDir: 'assets',

    // 生成 source map，方便调试
    sourcemap: true,

    // 压缩配置
    minify: 'terser',

    // 分块策略
    rollupOptions: {
      output: {
        // 手动分块
        manualChunks: {
          // React 相关库单独打包
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
});
