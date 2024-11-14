import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),  // Optional alias for cleaner imports
    },
  },
  build: {
    outDir: 'build',   // Ensure output goes to the 'build' directory
  },
  server: {
    open: true, // Automatically opens the app in the browser when dev server starts
    port: 3000,
  },
  css: {
    preprocessorOptions: {
      scss: {
        // Additional global SCSS configurations can be added here
        // For example, you can automatically include shared variables/mixins
        // using `additionalData` if needed.
      },
    },
  },
});
