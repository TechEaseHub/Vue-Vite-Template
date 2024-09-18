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
        // 通过 'files' 指定要应用规则的文件类型，避免 Vue 插件处理非 .vue 文件
        files: ['**/*.vue'],
        rules: {
            // 强制操作符在换行时放在前一行
            'vue/operator-linebreak': ['error', 'before'],
            // 关闭 Vue 文件中属性的默认排序规则
            'vue/attributes-order': 'off',
        },
    },
    {
        rules: {
            // 禁止混合使用空格和制表符，并自动修复智能标签（smart-tabs）
            'no-mixed-spaces-and-tabs': ['error', 'smart-tabs'],
            // 允许在代码中使用 console 语句（如 console.log）
            'no-console': 'off',
            // 关闭 node.js 中建议使用全局的 process 变量的规则
            'node/prefer-global/process': 'off',
            // 提醒并警告未使用的导入，但不抛出错误
            'unused-imports/no-unused-imports': 'warn',
            // 禁止在定义之前使用变量、类，但允许在定义之前使用函数
            '@typescript-eslint/no-use-before-define': ['error', { variables: false, functions: false, classes: true }],
        },
    },
)
