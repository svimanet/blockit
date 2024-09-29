import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        sw: resolve(__dirname, 'src/pwa/sw.ts'),
      },
      output: {
        chunkFileNames: '[name]-[hash].[ext]',
        assetFileNames: (file) => {
          if (file.name === 'favicon.png') {
            return 'public/favicon.png'
          }
          return 'public/[name]-[hash].[ext]'
        },
        entryFileNames: (file) => {
          if (file.name === 'sw') {
            return 'public/sw.js'
          }
         return  '[name]-[hash].js'
        },
      },
    },
  },
  server: {
    open: true, // Automatically open browser on dev server start
  },
});
