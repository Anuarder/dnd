import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/'],
    },
  },
  resolve: {
    alias: {
      '~': fileURLToPath(new URL('./src', import.meta.url)),
      '~app': fileURLToPath(new URL('./src/app', import.meta.url)),
      '~shared': fileURLToPath(new URL('./src/shared', import.meta.url)),
      '~entities': fileURLToPath(new URL('./src/entities', import.meta.url)),
      '~modules': fileURLToPath(new URL('./src/modules', import.meta.url)),
    },
  },
});
