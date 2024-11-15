import process from 'node:process'
import { fileURLToPath, URL } from 'node:url'

import Vue from '@vitejs/plugin-vue'
import { defineConfig, loadEnv } from 'vite'

// 自动导入
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import { VueRouterAutoImports } from 'unplugin-vue-router'
import VueRouter from 'unplugin-vue-router/vite'

// 开发者工具
import VueDevTools from 'vite-plugin-vue-devtools'
// 原子化 CSS
import UnoCSS from 'unocss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      VueRouter({
        routesFolder: 'src/views',
        exclude: ['src/views/public/**/*.vue', 'src/views/**/components/**/*.vue', 'src/views/**/*comp*.vue'],
        dts: 'types/typed-router.d.ts',
      }),
      Vue(),
      VueDevTools(),
      AutoImport({
        imports: [
          'vue',
          'pinia',
          VueRouterAutoImports,
          { 'vue-router/auto': ['useLink'] },
          '@vueuse/core',
        ],
        dts: 'types/auto-imports.d.ts',
        dirs: ['src/stores', 'src/utils'],
        resolvers: [ElementPlusResolver({ importStyle: 'sass' })],
      }),
      Components({
        directoryAsNamespace: false,
        collapseSamePrefixes: false,
        dts: 'types/components.d.ts',
        resolvers: [ElementPlusResolver({ importStyle: 'sass' })],
      }),
      UnoCSS(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '@comp': fileURLToPath(new URL('./src/components', import.meta.url)),
        '@views': fileURLToPath(new URL('./src/views', import.meta.url)),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
          additionalData: ` @use "@/styles/element/index.scss" as *;`,
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
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('element-plus'))
                return 'vendor-element-plus'
              if (id.includes('axios'))
                return 'vendor-axios'
              if (id.includes('lodash'))
                return 'vendor-lodash'
              if (id.includes('vue'))
                return 'vendor-vue'
              if (id.includes('pinia'))
                return 'vendor-pinia'
              return 'vendor'
            }
          },
        },
      },
    },
  }
})
