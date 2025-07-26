import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
    server: { 
        port: 3000,
        watch: {
            ignored: [
                '**/marijour-skins/**/dist/**',
                '**/marijour-skins/**/node_modules/**',
                '**/marijour-external-skin/dist/**',
                '**/.claude/**'
            ]
        }
    },
    plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
    ssr: {
        noExternal: ['gsap'],
    },
    build: {
        rollupOptions: {
            external: ['@withcookie/webbuilder-sdk']
        }
    }
});
