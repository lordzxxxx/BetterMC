import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1800,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router')) {
            return 'react-vendor'
          }
          if (id.includes('node_modules/lucide-react')) {
            return 'icons'
          }
          if (id.includes('node_modules/zod')) {
            return 'validation'
          }
          if (id.includes('node_modules/leaflet')) {
            return 'leaflet-vendor'
          }
          if (id.includes('src/barangayDisclosures')) {
            return 'barangay-disclosures'
          }
          if (id.includes('src/barangayOfficials')) {
            return 'barangay-officials'
          }
          if (id.includes('src/MalaybalayGisMap') || id.includes('src/malaybalayGisData')) {
            return 'malaybalay-gis'
          }
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    globals: true,
    exclude: ['e2e/**', 'node_modules/**'],
  },
})
