import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true,
  },
  server: {
    cors: true,
    port: 3000,
    strictPort: true,
    host: true,
  },
  preview: {
    cors: true,
    port: 3000,
    strictPort: true,
    host: true,
  },
});
