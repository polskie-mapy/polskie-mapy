import { defineConfig } from 'vite';
import { createVuePlugin as vue } from "vite-plugin-vue2";
import * as path from 'path';
import WindiCSS from 'vite-plugin-windicss'

export default defineConfig(async () => {
    return {
        plugins: [
            vue(),
            WindiCSS()
        ],
        resolve: {
            alias: {
                "@": path.resolve(__dirname, "./src"),
            },
        },
        define: {
            __APP_VERSION__: `"${(await import('./package.json')).version}"`,
            __APP_COLOR__: `"#fb923c"`,
            __APP_BUILT_DATE__: `"${new Date().toUTCString()}"`,
        },
        worker: {
            format: 'es',
        },
        build: {
            sourcemap: true,
        }
    };
})