import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/SimbirSoft_solution/', // Basic path for GitHub Pages matching repository name
  server: {
    port: 5173,
    open: true,
    proxy: {
      '/api/football': {
        target: 'https://api.football-data.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/football/, '/v4'),
      },
    },
  },
  preview: {
    port: 4173,
  },
});
