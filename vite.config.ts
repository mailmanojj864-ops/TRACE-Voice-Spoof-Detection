
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': process.env
  },
  server: {
    // Allows the dev server to be accessed from Render if needed
    allowedHosts: ['.onrender.com']
  },
  preview: {
    // Fixes the "Blocked Request" error on Render
    allowedHosts: ['.onrender.com'],
    // Ensure it uses the Render expected port
    port: 10000,
    host: true
  }
});
