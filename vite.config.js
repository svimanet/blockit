import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/blockit/',
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
          console.log(file.name);
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
