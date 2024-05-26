import type { logoMode } from '@/layout/type'

export default defineStore(
    'layout',
    () => {
        /** 侧边栏是否折叠 */
        const isCollapse = ref(false)
        const logoMode = ref<logoMode>('vertical')

        /** 切换侧边栏折叠 */
        const changeCollapse = () => {
            isCollapse.value = !isCollapse.value
        }

        // 使用  Setup Stores 需要创建自己的 $reset() 方法
        function $reset() {

        }

        return { isCollapse, logoMode, changeCollapse, $reset }
    },
    {
        persist: true,
    },
)
