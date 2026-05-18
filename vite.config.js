import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    visualizer({
      open: false,
      filename: 'stats.html',
      gzipSize: true,
      brotliSize: true,
    })
  ],
  server: {
    proxy: {
      // Les requêtes /api/*.php sont relayées vers le serveur PHP local (port 8000)
      // En production sur OVH, Apache sert ces fichiers directement.
      '^/api/.*\\.php$': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      // Les autres routes /api (auth, chat, faq, admin, visit) restent sur Express
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    }
  }
})
