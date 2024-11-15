import antfu from '@antfu/eslint-config'

export default antfu(
  {
    type: 'app',
    lessOpinionated: false,

    stylistic: {
      indent: 2,
      quotes: 'single',
    },

    // TypeScript 和 Vue 是自动检测的，你也可以明确启用它们：
    typescript: true,
    vue: true,

    // jsonc: false,
    // yaml: false,

    unocss: true,

    // Flat 配置不再支持 `.eslintignore`，请改用 `ignores`
    ignores: [
      '**/fixtures',
      '.commitlintrc.cjs',
    ],

    formatters: {
      css: true,
      html: true,
    },

  },
  { // 记得在这里指定文件 glob，否则可能会导致 vue 插件处理非 vue 文件
    files: ['**/*.vue'],
    rules: {},
  },
  { // 如果没有“文件”，它们是所有文件的通用规则
    rules: {
      'no-console': 'off',
      'curly': ['error', 'multi-or-nest', 'consistent'], // 统一括号块
      'style/brace-style': ['error', 'stroustrup', { allowSingleLine: true }], // 统一括号块
    },
  },
)
