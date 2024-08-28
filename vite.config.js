import { defineConfig } from 'vite';
import vue from "@vitejs/plugin-vue";
import * as path from 'path';
import WindiCSS from 'vite-plugin-windicss'
export default defineConfig(async () => {
    return {
        plugins: [
            vue({
                template: {
                    compilerOptions: {
                        compatConfig: {
                            RENDER_FUNCTION: false,
                            MODE: 3,
                        }
                    }
                }
            }),
            WindiCSS()
        ],
        resolve: {
            alias: {
                "@": path.resolve(__dirname, "./src"),
                vue: '@vue/compat'
                
            },
        },
        define: {
            __APP_VERSION__: `"${(await import('./package.json')).version}"`,
            __APP_COLOR__: `"#fb923c"`,
            __APP_BUILT_DATE__: `"${new Date().toUTCString()}"`,
        },
        worker: {
            format: 'es',
        }
    };
})