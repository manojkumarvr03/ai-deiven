import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        // Keep this aligned with the backend development environment.
        // VITE_API_PROXY_TARGET allows a different backend address without
        // changing source code for staging or local Docker environments.
        target: process.env.VITE_API_PROXY_TARGET || 'http://localhost:5001',
        changeOrigin: true,
        secure: false
      }
    }
  }
});
