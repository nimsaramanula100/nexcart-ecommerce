import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite development setup: enable React transforms and forward /api calls to the local backend.
// Vite සංවර්ධන සැකසුම: React transform සක්‍රීය කර /api ඉල්ලීම් දේශීය backend වෙත යොමු කරයි.
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
