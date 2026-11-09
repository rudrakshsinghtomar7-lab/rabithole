import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Relative base so the static build works from any path (e.g. GitHub Pages).
// /api is proxied to the optional generation server (npm run server).
export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    proxy: { '/api': 'http://localhost:8790' },
  },
})
