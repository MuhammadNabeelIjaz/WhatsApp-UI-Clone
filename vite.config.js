import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
    plugins: [
        react(),
        tailwindcss()
    ],
    resolve: {
        alias: {
            '@app':      path.resolve(__dirname, 'src/app'),
            '@core':     path.resolve(__dirname, 'src/core'),
            '@features': path.resolve(__dirname, 'src/features'),
            '@shared':   path.resolve(__dirname, 'src/shared'),
            '@assets':   path.resolve(__dirname, 'src/assets'),
            '@constants': path.resolve(__dirname, 'src/core/constants'),
            '@store':     path.resolve(__dirname, 'src/core/store/index.js'),
            '@utils':     path.resolve(__dirname, 'src/core/utils'),
            '@theme':     path.resolve(__dirname, 'src/core/theme'),
            '@data':      path.resolve(__dirname, 'src/core/data'),
            '@context':   path.resolve(__dirname, 'src/app/providers'),
            '@i18n':      path.resolve(__dirname, 'src/i18n'),
            '@layouts':   path.resolve(__dirname, 'src/app/layouts'),
            '@navigation':path.resolve(__dirname, 'src/app/navigation'),
        }
    },
    build: {
        chunkSizeWarningLimit: 800,
        rollupOptions: {
            output: {
                manualChunks: (id) => {
                    // ── Single vendor chunk for all node_modules ──────────────
                    // Splitting vendor by package caused vendor-misc → vendor-react → vendor-misc
                    // circular chunk warnings. One "vendors" chunk avoids this entirely.
                    if (id.includes('node_modules/')) return 'vendors';
                    // Skeletons: pure UI, no circular risk
                    if (id.includes('/shared/ui/skeletons/')) return 'shared-skeletons';
                }
            }
        }
    }
});
