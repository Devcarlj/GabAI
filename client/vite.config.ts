import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        manifest: false
      })
    ],
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              // Core React libraries
              if (
                id.includes('react') ||
                id.includes('react-dom') ||
                id.includes('react-router-dom')
              ) {
                return 'react-vendor';
              }
              // Map libraries (leaflet, mapbox, maplibre, etc.)
              if (
                id.includes('leaflet') || 
                id.includes('react-leaflet') ||
                id.includes('mapbox') ||
                id.includes('maplibre')
              ) {
                return 'map-vendor';
              }
              if (id.includes('axios')) {
                return 'axios';
              }
              return 'vendor';
            }
          }
        }
      }
    },
    server: {
      host: true,
      port: 5173,
      proxy: {
        '/api': {
          target: env.VITE_SERVER_URL || process.env.VITE_SERVER_URL || 'http://localhost:5000',
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});