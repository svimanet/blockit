import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/main.ts'),
      },
      output: {
        entryFileNames: 'game.js',
        // format: 'iife', // Immediately-invoked function expression for a single file bundle
      },
    },
  },
  server: {
    open: true, // Automatically open browser on dev server start
  },
});
