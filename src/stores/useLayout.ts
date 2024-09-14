export type LayoutMode = 'horizontal' | 'vertical' | 'mix'

export const LayoutStore = defineStore(
    'layout',
    () => {
        /**
         * 侧边栏是否折叠
         *
         * @default false
         */
        const isCollapse = ref(false)
        /** 切换侧边栏折叠 */
        const changeCollapse = () => {
            isCollapse.value = !isCollapse.value
        }
        /**
         * LayoutMode 布局模式
         *
         * @default 'vertical'
         */
        const layoutMode = ref<LayoutMode>('vertical')
        /**
         * 设置 LayoutMode 布局模式
         * @param mode `horizontal` | `vertical` | `mix`
         */
        const SetLayoutMode = (mode: LayoutMode) => {
            layoutMode.value = mode
        }

        // 使用  Setup Stores 需要创建自己的 $reset() 方法
        function $reset() {

        }

        return { isCollapse, changeCollapse, layoutMode, SetLayoutMode, $reset }
    },
    { persist: true },
)
