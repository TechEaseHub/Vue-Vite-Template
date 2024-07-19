import LogoSrc from '@/assets/logo.svg'
import type { LayoutMode } from '@/stores/layout'

const { isCollapse } = storeToRefs(LayoutStore())
const { changeCollapse } = LayoutStore()

export default defineComponent({
    name: 'Logo',
    props: {
        mode: {
            type: String as PropType<Exclude<LayoutMode, 'mix'>>,
            required: true,
        },
    },
    setup({ mode }) {
        const isVertical = computed(() => mode === 'vertical')
        const isHorizontal = computed(() => mode === 'horizontal')

        const src = import.meta.env.VITE_LOGO_URL || LogoSrc // 项目logo地址

        return () => {
            return h(
                'div',
                {
                    class: [
                        'h-60 flex justify-between items-center flex-shrink-0',
                        isVertical.value && 'w-249 border-b-1 border-b-solid border-b-[var(--el-border-color)]',
                        isHorizontal.value && 'w-201 border-r-1 border-r-solid border-r-[var(--el-border-color)]',
                        isVertical.value && isCollapse.value && 'w-64',
                    ],
                },
                [
                    h(
                        ElLink,
                        {
                            class: [isVertical.value && isCollapse.value && 'hidden!'],
                            href: '/',
                            underline: false,
                        },
                        () => [
                            h('img', {
                                class: 'w-200',
                                src,
                                title: import.meta.env.VITE_APP_NAME,
                            }),
                        ],
                    ),
                    isVertical.value
                    && h(
                        ElIcon,
                        {
                            class: 'flex-1 cursor-pointer',
                            size: '24px',
                            onClick: () => changeCollapse(),
                        },
                        () => h('i', { class: [isCollapse.value ? 'i-ep:expand' : 'i-ep:fold'] }),
                    ),
                ],
            )
        }
    },

})
