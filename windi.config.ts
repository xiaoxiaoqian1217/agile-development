import { defineConfig } from 'vite-plugin-windicss';
export default defineConfig({
  safelist: 'bg-default bg-processing  bg-success bg-warning bg-error',
  theme: {
    extend: {
      colors: {
        // 优先级颜色配置
        default: '#8c8c8c',
        processing: '#1b9aee',
        success: '#15ad31',
        warning: '#fa8c15',
        error: '#e62412',
        // 在这里配置你的调色板
      },
    },
  },
});
