import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    tailwindcss()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 600, // Increase warning limit to 600kb
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-components': [
            'lucide-react',
            '@radix-ui/react-popover',
          ],
          'data-libs': [
            '@tanstack/react-query',
            'recharts',
            'rxjs',
          ],
        },
      },
      // Exclude experiments directory from build
      external: [
        /^\/experiments\//
      ]
    },
  },
  server: {
    host: '0.0.0.0', // Listen on all addresses
    port: 5173,
    strictPort: true,
    cors: true,
    allowedHosts: [
      'localhost',
      '.local'  // This will match any subdomain ending with .local
    ],
    hmr: {
      // Allow any host ending with .local to connect for HMR
      host: 'localhost',
      clientPort: 5173,
      protocol: 'ws',
    },
    watch: {
      usePolling: true,
      // Exclude experiments directory from file watching
      ignored: ['**/node_modules/**', '**/experiments/**']
    },
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
  },
})
