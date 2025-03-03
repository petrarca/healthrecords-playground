import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react()
  ],
  root: path.resolve(__dirname),
  base: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@services': path.resolve(__dirname, './src/services'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@types': path.resolve(__dirname, './src/types'),
    },
  },
  server: {
    host: '0.0.0.0', // Listen on all addresses
    port: 5174,
    strictPort: true,
    cors: true,
    allowedHosts: [
      'localhost',
      '.local'  // This will match any subdomain ending with .local
    ],
    hmr: {
      // Allow any host ending with .local to connect for HMR
      host: 'localhost',
      clientPort: 5174,
      protocol: 'ws',
    },
    watch: {
      usePolling: true,
      ignored: ['**/node_modules/**']
    },
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
  },
  optimizeDeps: {
    include: ['@tensorflow/tfjs', '@tensorflow-models/universal-sentence-encoder']
  }
})
