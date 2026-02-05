
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': process.env
  },
  server: {
    // Allows the dev server to be accessed from Render subdomains
    allowedHosts: ['.onrender.com']
  },
  preview: {
    // Fixes the "Blocked Request" error on Render production URLs
    allowedHosts: ['.onrender.com'],
    // Ensure it uses the Render default port
    port: 10000,
    host: true,
    strictPort: true
  }
});
