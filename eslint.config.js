import antfu from '@antfu/eslint-config'

export default antfu(
    {
        // 启用样式格式设置规则
        // stylistic: true,
        // 或者自定义风格规则
        stylistic: {
            indent: 4, // 4, or 'tab'
            quotes: 'single', // or 'double'
        },

        // TypeScript 和 Vue 是自动检测的，您也可以显式启用它们：
        vue: true,
        typescript: true,

        // 禁用 jsonc 和 yaml 支持
        jsonc: true,
        yaml: false,

        // Flat 配置中不再支持 `.eslintignore`，请改用 `ignores`
        ignores: [
            '**/fixtures',
            '.commitlintrc.cjs',
            '.versionrc.cjs',
            // ...globs,
        ],
        formatters: {
            css: true,
            html: true,
        },
        unocss: true,
    },
    // 从第二个参数来看，它们是 ESLint Flat Configs
    // 你可以有多个配置
    {
        // 记得在这里指定文件 glob，否则可能会导致 vue 插件处理非 vue 文件
        files: ['**/*.vue'],
        rules: {
            'vue/operator-linebreak': ['error', 'before'],
        },
    },
    {
        // 如果没有“文件”，它们是所有文件的通用规则
        rules: {
            // 使用 smart-tabs 选项自动修复混合使用空格和制表符的问题
            'no-mixed-spaces-and-tabs': ['error', 'smart-tabs'],
            'no-console': 'off',
            'node/prefer-global/process': 'off',
            'unused-imports/no-unused-imports': 'warn',
        },
    },
)
