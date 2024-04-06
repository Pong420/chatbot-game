import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    setupFiles: ['reflect-metadata']
  },
  define: {
    'process.env.LOCALE': JSON.stringify('zh-tw'),
    'process.env.SUPABASE_URL': JSON.stringify('http://127.0.0.1:54321'),
    'process.env.SUPABASE_SERVICE_KEY': JSON.stringify('SUPABASE_SERVICE_KEY')
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});
