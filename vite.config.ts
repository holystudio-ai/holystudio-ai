import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import devApiPlugin from './vite-plugin-dev-api.js';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');

    // Make .env values available to Node.js plugins (e.g. vite-plugin-dev-api)
    // Always overwrite process.env with .env values for consistency
    for (const key of ['COURSE_PRICE_UAH', 'WFP_MERCHANT_LOGIN', 'WFP_MERCHANT_SECRET', 'SITE_URL', 'MONGODB_URI', 'RESEND_API_KEY', 'RESEND_FROM', 'CRON_SECRET', 'WFP_MERCHANT_PASSWORD']) {
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
        ],
        define: {
            'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
            'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
            'process.env.COURSE_PRICE_UAH': JSON.stringify(env.COURSE_PRICE_UAH || '490'),
            'process.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL || ''),
        },
        resolve: {
            alias: {
                '@': path.resolve(__dirname, '.'),
            }
        }
    };
});
