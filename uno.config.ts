// unoCss 处理工具 请参阅 unocss.config.ts 进行配置 https://github.com/antfu/unocss  https://unocss.dev/interactive/
import presetRemToPx from '@unocss/preset-rem-to-px'
import { defineConfig, presetAttributify, presetIcons, presetUno, transformerDirectives, transformerVariantGroup } from 'unocss'

export default defineConfig({
    content: {
        pipeline: {
            include: [
                // 默认情况下不会提取 js/ts
                /\.(vue|ts)($|\?)/,
            ],
        },
    },
    /**
     * https://unocss.dev/guide/extracting#limitations
     *
     * 若使用动态连接css，需要添加到 `safelist` 中将会激活，因为动态的不会检测到，需要手动注册
     * class="bg-blue-${size}"      =>      ...Array.from({ length: 4 }, (_, i) => `bg-blue-${i + 1}`),
     *
     * 或使用 @unocss/runtime
     * <script src="https://cdn.jsdelivr.net/npm/@unocss/runtime"></script>
     */
    // safelist: [
    //     ...Array.from({ length: 4 }, (_, i) => `bg-primary-${i * 2 + 3}`),
    // ],

    // 快捷方式
    shortcuts: [
        ['flex-center', 'flex justify-center items-center'],
    ],
    rules: [
        [
            'no-select', // 不可被用户选中的元素
            {
                'user-select': 'none',
                '-webkit-user-select': 'none', // Chrome, Safari, 新版 Edge
                '-moz-user-select': 'none', // Firefox
                '-ms-user-select': 'none', // 旧版 IE 和 Edge
            },
        ],
    ],
    presets: [
        presetUno(),
        presetAttributify(),
        presetIcons({
            scale: 1.2,
            warn: true,
            extraProperties: {
                'display': 'inline-block',
                'vertical-align': 'middle',
            },
        }),
        presetRemToPx({
            baseFontSize: 4,
        }),
    ],
    transformers: [transformerDirectives(), transformerVariantGroup()],
})
