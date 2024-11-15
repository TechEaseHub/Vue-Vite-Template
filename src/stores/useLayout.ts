/**
 * 布局模式类型
 */
export type LayoutModeType = 'horizontal' | 'vertical' | 'mix'

/**
 * 使用 layout store，管理布局模式及侧边栏状态
 */
export const useLayoutStore = defineStore(
  'layout',
  () => {
    const isCollapsed = ref(false)

    const toggleCollapse = (): void => {
      isCollapsed.value = !isCollapsed.value
    }

    const layoutMode = ref<LayoutModeType>('vertical')

    const setLayoutMode = (mode: LayoutModeType): void => {
      layoutMode.value = mode
    }

    const resetStore = (): void => {
      isCollapsed.value = false
      layoutMode.value = 'vertical'
    }

    return {
    /**
     * 侧边栏是否折叠
     *
     * @default false
     */
      isCollapsed,
      /**
       * 切换侧边栏折叠状态
       * @returns {void}
       */
      toggleCollapse,
      /**
       * 布局模式
       *
       * @default 'vertical'
       */
      layoutMode,
      /**
       * 设置布局模式
       *
       * @param {LayoutModeType} mode 布局模式，可选 'horizontal' | 'vertical' | 'mix'
       * @returns {void}
       */
      setLayoutMode,
      /**
       * 重置 layout store 到默认状态
       *
       * @returns {void}
       */
      resetStore,
    }
  },
  {
    persist: true,
  },
)
