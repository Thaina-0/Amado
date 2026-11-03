/// <reference types="vitest/config" />
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      // why: the default head <script src="/registerSW.js"> blocks the first paint; main.tsx registers the worker after load instead
      injectRegister: false,
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        // why: photos are heavy and not vital, so they are cached on first sight instead of blocking the install of the emergency screens
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/places/'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'place-photos',
              expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
      manifest: {
        name: 'Amado',
        short_name: 'Amado',
        description: 'Ilhéus contada por quem ama. Descubra, circule e peça ajuda.',
        lang: 'pt-BR',
        theme_color: '#5C3A2A',
        background_color: '#F3ECDF',
        display: 'standalone',
        icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' }],
      },
    }),
  ],
  server: { host: true, allowedHosts: ['dev.local'] },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test-utils/setup.ts'],
    globals: false,
  },
})
