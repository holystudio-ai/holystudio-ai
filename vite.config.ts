import fs from 'fs';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import devApiPlugin from './vite-plugin-dev-api.js';

function copyStandaloneHtml() {
    const files = ['promts_intensive.html', 'holystudio-ai-director-guide.html'];
    return {
        name: 'copy-standalone-html',
        configureServer(server) {
            server.middlewares.use((req, res, next) => {
                const url = (req.url || '').split('?')[0];
                if (url === '/guide' || url === '/guide/' || url === '/holystudio-ai-director-guide' || url === '/holystudio-ai-director-guide/') {
                    res.statusCode = 302;
                    res.setHeader('Location', '/holystudio-ai-director-guide.html');
                    res.end();
                    return;
                }
                next();
            });
        },
        closeBundle() {
            for (const name of files) {
                const sourceFile = path.resolve(__dirname, 'public', name);
                const outputFile = path.resolve(__dirname, 'dist', name);
                if (fs.existsSync(sourceFile)) {
                    fs.copyFileSync(sourceFile, outputFile);
                }
            }
        },
    };
}

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');

    // Make .env values available to Node.js plugins (e.g. vite-plugin-dev-api)
    // Always overwrite process.env with .env values for consistency
    for (const key of ['COURSE_PRICE_UAH', 'WFP_MERCHANT_LOGIN', 'WFP_MERCHANT_SECRET', 'SITE_URL', 'MONGODB_URI', 'RESEND_API_KEY', 'RESEND_FROM', 'CRON_SECRET', 'WFP_MERCHANT_PASSWORD', 'MERCHANT_DOMAIN', 'PRODUCT_NAME', 'CURRENCY', 'ADMIN_EMAIL', 'ADMIN_PASSWORD', 'DEV_TEST_TOKEN', 'DEV_TEST_EMAIL', 'DEV_TEST_ORDER', 'TELEGRAM_BOT_USERNAME', 'BOT_URL', 'INSTAGRAM_URL', 'WFP_RETURN_URL', 'WFP_FAILED_URL']) {
        if (env[key]) {
            process.env[key] = env[key];
        }
    }

    return {
        server: {
            port: 5555,
            strictPort: true,
            host: '0.0.0.0',
        },
        plugins: [
            react(),
            devApiPlugin(),
            copyStandaloneHtml(),
        ],
        define: {
            'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
            'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
            'process.env.COURSE_PRICE_UAH': JSON.stringify(env.COURSE_PRICE_UAH || '490'),
            'process.env.VITE_API_URL': JSON.stringify(mode === 'development' ? '' : (env.VITE_API_URL || '')),
            'process.env.PRODUCT_NAME': JSON.stringify(env.PRODUCT_NAME || ''),
            'process.env.SMARTSENDER_IDENTIFIER': JSON.stringify(env.SMARTSENDER_IDENTIFIER || ''),
            'process.env.SMARTSENDER_PIXEL_URL': JSON.stringify(env.SMARTSENDER_PIXEL_URL || ''),
        },
        resolve: {
            alias: {
                '@': path.resolve(__dirname, '.'),
            }
        },
        build: {
            rollupOptions: {
                output: {
                    // The "b-" generation prefix retires every previously cached
                    // asset URL at once: browsers that cached poisoned responses
                    // (HTML served under .js URLs during the 2026-07-30 outage,
                    // stored as immutable) never see those URLs referenced again.
                    // Bump the prefix if a poisoning incident ever recurs.
                    entryFileNames: 'assets/b-[name]-[hash].js',
                    chunkFileNames: 'assets/b-[name]-[hash].js',
                    assetFileNames: 'assets/b-[name]-[hash][extname]',
                },
            },
        }
    };
});
