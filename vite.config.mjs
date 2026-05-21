import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import Vue from '@vitejs/plugin-vue'
import VueRouter from 'unplugin-vue-router/vite'
import Components from 'unplugin-vue-components/vite'

export default defineConfig({
  plugins: [
    VueRouter(),
    Vue(),
    Components({
      // Auto-import des composants vue-dsfr
      resolvers: [
        (componentName) => {
          if (componentName.startsWith('Dsfr')) {
            return { name: componentName, from: '@gouvminint/vue-dsfr' }
          }
        }
      ]
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('src', import.meta.url)),
    },
    extensions: ['.js', '.json', '.jsx', '.mjs', '.ts', '.tsx', '.vue'],
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
  test: {
    environment: 'happy-dom',
    globals: true,
    exclude: ['e2e/**', 'node_modules/**'],
  },
})
