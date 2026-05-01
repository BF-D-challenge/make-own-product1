import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    proxy: {
      '/quiz-api': {
        target: 'http://www.baec23.com:20001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/quiz-api/, ''),
      },
    },
  },
})
