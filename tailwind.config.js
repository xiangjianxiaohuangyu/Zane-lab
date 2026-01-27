/** @type {import('tailwindcss').Config} */
export default {
  // Tailwind 扫描的文件路径，用于生成样式
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  // 深色模式策略：使用 class 模式
  darkMode: 'class',

  // 主题配置
  theme: {
    // 扩展默认主题
    extend: {
      // 自定义颜色：玻璃拟态色系
      colors: {
        // 玻璃拟态透明度层级
        glass: {
          100: 'rgba(255, 255, 255, 0.05)',  // 最浅透明
          200: 'rgba(255, 255, 255, 0.1)',   // 中等透明
          300: 'rgba(255, 255, 255, 0.15)',  // 较深透明
        },
        // 背景色系
        background: {
          primary: '#0a0a0f',    // 主背景色
          secondary: '#12121a',  // 次背景色
        },
        // 文字色系
        text: {
          primary: '#f0f0f5',    // 主要文字
          secondary: '#a0a0b0',  // 次要文字
        },
      },

      // 自定义背景模糊值
      backdropBlur: {
        glass: '12px',  // 玻璃拟态专用模糊度
      },

      // 自定义字体（可选）
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },

      // 自定义间距（可选）
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },

      // 自定义动画时长
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
      },
    },
  },

  // 插件配置
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
