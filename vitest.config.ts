import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';
import { default as env } from '@next/env';

const { combinedEnv } = env.loadEnvConfig(__dirname, true);

export default defineConfig({
  test: {
    setupFiles: ['reflect-metadata', './testSetup.ts']
  },
  plugins: [tsconfigPaths()],
  define: {
    ...Object.entries(combinedEnv).reduce((define, [k, v]) => ({ ...define, [k]: JSON.stringify(v) }), {})
  }
});
