import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    setupFiles: ['reflect-metadata']
  },
  define: {
    'process.env.LOCALE': JSON.stringify('zh-tw')
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});
