import { defineConfig } from 'vite';
import { resolve } from 'path';
import copy from 'rollup-plugin-copy';

export default defineConfig({
  build: {
    outDir: '../dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/main.ts'),
      },
      output: {
        entryFileNames: 'game.js',
        format: 'iife', // Immediately-invoked function expression for a single file bundle
      },
      plugins: [
        copy({
          targets: [
            { src: resolve(__dirname, 'src/index.html'), dest: '../dist' },
            { src: resolve(__dirname, '../node_modules/htmx.org/dist/htmx.js'), dest: '../dist' },
          ]
        })
      ]
    },
  },
  server: {
    open: true, // Automatically open browser on dev server start
  },
});
