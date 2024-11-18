import { defineConfig } from 'vite';

export default defineConfig({
  base: '/blockit/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: './index.html',
        serviceworker: './src/pwa/serviceworker.ts'
      },
      output: {
        assetFileNames: () => '[name].[ext]',
        entryFileNames: () => '[name].js'
      },
    },
  },
});
