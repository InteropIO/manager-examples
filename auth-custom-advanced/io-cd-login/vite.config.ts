import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [],
  build: {
    sourcemap: true,
  },
  server: {
    port: 3000,
    strictPort: true,
  },
});
