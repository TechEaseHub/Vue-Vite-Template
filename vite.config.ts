import { URL, fileURLToPath } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

import UnoCSS from 'unocss/vite'

// 自动导入
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'

// element-plus 按需自动导入
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '')

    return {
        plugins: [
            vue(),
            UnoCSS(),
            AutoImport({
                imports: ['vue', 'vue-router', 'pinia'],
                dts: 'types/auto-imports.d.ts',
                resolvers: [ElementPlusResolver({ importStyle: 'sass' })],
            }),
            Components({
                dts: 'types/components.d.ts',
                resolvers: [ElementPlusResolver({ importStyle: 'sass' })],
            }),
        ],
        base: './',
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url)),
            },
        },
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: `@use "@/styles/element/index.scss" as *;`,
                },
            },
        },
        server: {
            host: '0.0.0.0',
            hmr: true,
            open: true,
            proxy: {
                [env.VITE_BASE_API]: {
                    // 代理地址
                    target: env.VITE_PROXY_URL,
                    // 是否跨域
                    changeOrigin: true,
                    // 重写路径
                    rewrite: path => path.replace(new RegExp(`^${env.VITE_BASE_API}`), ''),
                },
            },
        },
    }
})
