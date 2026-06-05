import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/accounts': 'http://127.0.0.1:8000',
      '/dashboard': 'http://127.0.0.1:8000',
      '/medicines': 'http://127.0.0.1:8000',
      '/orders': 'http://127.0.0.1:8000',
      '/contact': 'http://127.0.0.1:8000',
      '/notifications': 'http://127.0.0.1:8000',
      '/ws': {
        target: 'ws://127.0.0.1:8000',
        ws: true,
      },
    },
  },
})
