import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig(({ mode: _mode }) => ({
  base: '/app_651603562242/',
  plugins: [react()],
  server: {
    allowedHosts: true,
    hmr: false, // 禁用 HMR 以减少网络请求错误
    port: 5173,
    open: true,
    cors: true,
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
  build: {
    target: 'esnext',
    outDir: 'dist',
    assetsDir: 'assets',
  },
}));



