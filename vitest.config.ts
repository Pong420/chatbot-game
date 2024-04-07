import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    setupFiles: ['reflect-metadata']
  },
  plugins: [tsconfigPaths()],
  define: {
    'process.env.LOCALE': JSON.stringify('zh-tw'),
    'process.env.LINE_CHANNEL_SECRET': JSON.stringify('LINE_CHANNEL_SECRET'),
    'process.env.LINE_CHANNEL_ACCESS_TOKEN': JSON.stringify('LINE_CHANNEL_ACCESS_TOKEN'),
    'process.env.SUPABASE_URL': JSON.stringify('http://127.0.0.1:54321'),
    'process.env.SUPABASE_SERVICE_KEY': JSON.stringify(`'SUPABASE_SERVICE_KEY'`)
  }
});
