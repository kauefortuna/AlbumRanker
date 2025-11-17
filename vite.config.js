import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/AlbumRanker/',
  plugins: [react()],
  server: {
    host: '127.0.0.1', // forces it to bind to this IP
    port: 5173,        // optional, default is 5173
  },
})
