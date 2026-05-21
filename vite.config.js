import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Set VITE_BASE=/your-repo-name/ when building for GitHub Pages project sites.
  base: process.env.VITE_BASE || '/',
  plugins: [react()],
})
