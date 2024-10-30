import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [],
  build: {
    sourcemap: true,
  },
  server: {
    port: 9123,
    strictPort: true,
  },
});
