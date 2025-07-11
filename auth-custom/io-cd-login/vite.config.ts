import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [],
  build: {
    sourcemap: true,
  },
  server: {
    port: 3010,
    strictPort: true,
  },
});
