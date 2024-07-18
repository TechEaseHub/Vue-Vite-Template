import { URL, fileURLToPath } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import Vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

import UnoCSS from 'unocss/vite'

// 自动导入
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
// element-plus 按需自动导入
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// 路由自动导入
import VueRouter from 'unplugin-vue-router/vite'
import { VueRouterAutoImports } from 'unplugin-vue-router'

// 打包分析
import { visualizer } from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '')

    return {
        plugins: [
            // https://github.com/posva/unplugin-vue-router
            VueRouter({
                routesFolder: 'src/views',
                exclude: ['src/views/public/**/*.vue'],
                dts: 'types/typed-router.d.ts',
            }),
            Vue(),
            vueDevTools(),
            UnoCSS(),
            AutoImport({
                imports: [
                    'vue',
                    'pinia',
                    VueRouterAutoImports,
                    { 'vue-router/auto': ['useLink'] },
                ],
                dts: 'types/auto-imports.d.ts',
                dirs: ['src/stores'],
                resolvers: [ElementPlusResolver({ importStyle: 'sass' })],
            }),
            Components({
                dts: 'types/components.d.ts',
                resolvers: [ElementPlusResolver({ importStyle: 'sass' })],
            }),
            visualizer({
                open: false,
                gzipSize: true,
            }),
            // viteCompression(),
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
        build: {
            rollupOptions: {
                // 静态资源分类打包
                output: {
                    chunkFileNames: 'js/[name]-[hash].js',
                    entryFileNames: 'js/[name]-[hash].js',
                    assetFileNames: '[ext]/[name]-[hash].[ext]',
                    // manualChunks(id) {
                    //     if (id.includes('node_modules')) {
                    //         if (id.includes('element-plus'))
                    //             return 'vendor-element-plus'
                    //         if (id.includes('axios'))
                    //             return 'vendor-axios'
                    //         if (id.includes('lodash'))
                    //             return 'vendor-lodash'
                    //         if (id.includes('vue'))
                    //             return 'vendor-vue'
                    //         if (id.includes('pinia'))
                    //             return 'vendor-pinia'
                    //         return 'vendor'
                    //     }
                    //     if (id.includes('src/views'))
                    //         return `vendor-views`

                    //     if (id.includes('src/components'))
                    //         return `vendor-components`

                    //     if (id.includes('src/styles'))
                    //         return 'styles'
                    // },
                },
            },
        },
    }
})
