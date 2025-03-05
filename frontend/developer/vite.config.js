import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react()
    ],
    root: path.resolve(__dirname),
    base: process.env.NODE_ENV === 'production' ? '/developer/' : './',
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@components': path.resolve(__dirname, './src/components'),
            '@services': path.resolve(__dirname, './src/services'),
            '@styles': path.resolve(__dirname, './src/styles'),
            '@types': path.resolve(__dirname, './src/types'),
            '@src': path.resolve(__dirname, '../src'),
        },
    },
    server: {
        host: '0.0.0.0', // Listen on all addresses
        port: 5174,
        strictPort: true,
        cors: true,
        allowedHosts: [
            'localhost',
            '.local' // This will match any subdomain ending with .local
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
});
