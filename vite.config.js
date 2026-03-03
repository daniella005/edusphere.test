import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/js/edusphere-connect/main.tsx',
            ],
            refresh: true,
        }),
        react(),
    ],
    server: {
            host: '127.0.0.1',  // Important : utiliser 127.0.0.1 au lieu de localhost
            port: 5174,
            strictPort: true,
            hmr: {
                host: '127.0.0.1',
            },
            cors: true,  // Ajouter cette ligne pour autoriser CORS
   },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'resources/js/edusphere-connect'),
        },
    },
});