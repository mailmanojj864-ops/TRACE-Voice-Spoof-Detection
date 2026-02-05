
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Ensure the app is served from the root. 
  // This prevents blank pages caused by asset path mismatches.
  base: '/',
  build: {
    outDir: 'dist',
    sourcemap: false,
    // Ensure assets are placed in a consistent folder
    assetsDir: 'assets',
    // Polyfill or transform settings if targeting older browsers
    target: 'esnext'
  },
  define: {
    // Allows process.env to be used in the browser if needed
    'process.env': {}
  },
  // Dev-only settings (ignored by Render Static Site during build)
  server: {
    port: 3000,
    host: true
  }
});
