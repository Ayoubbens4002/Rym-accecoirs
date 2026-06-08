import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const proxyTarget = env.VITE_PROXY_TARGET || 'http://127.0.0.1:8000'
  const base = env.VITE_BASE || (command === 'build' ? '/Rym-accecoirs/' : '/')

  return {
    base,
    plugins: [react(), tailwindcss()],
    build: {
      outDir: 'docs',
    },
    server: {
      proxy: {
        '/api': {
          target: proxyTarget,
          changeOrigin: true,
          secure: false, 
        },
        '/sanctum': {
          target: proxyTarget,
          changeOrigin: true,
        },
        '/storage': {
          target: proxyTarget,
          changeOrigin: true,
        },
      },
    },
  }
})
