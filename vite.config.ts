
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Removed define: { 'process.env': {} } to allow access to process.env.API_KEY 
  // as per the environment configuration requirements.
})
