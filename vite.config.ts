import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
  },
  publicDir: 'public', // Esto asegura que los archivos de public/ se copien a dist/
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});