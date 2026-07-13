/// <reference types="vitest/config" />
import { defineConfig } from 'vite';

// AgentMarvin M0 — plain Vite + TS, no framework.
// Map JSON lives in /public/maps and is fetched at runtime so designers/modders
// can edit levels without a rebuild (see docs/11-technical-spec.md).
export default defineConfig({
  root: '.',
  publicDir: 'public',
  build: {
    target: 'es2022',
    outDir: 'dist',
    sourcemap: true,
  },
  test: {
    environment: 'node',
    include: ['test/**/*.test.ts'],
  },
});
