import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/scrape': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/results': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/history': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/leads': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/download-csv': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      }
    }
  }
})
