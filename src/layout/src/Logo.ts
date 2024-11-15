import type { LayoutModeType } from '@/stores/useLayout'
import LogoSrc from '@/assets/logo.svg'

export default defineComponent({
  name: 'LayoutLogo',
  props: {
    mode: {
      type: String as PropType<Exclude<LayoutModeType, 'mix'>>,
      required: true,
    },
  },
  setup(props) {
    const layoutStore = useLayoutStore()
    const router = useRouter()

    const isVertical = computed(() => props.mode === 'vertical')
    const isHorizontal = computed(() => props.mode === 'horizontal')

    const src = import.meta.env.VITE_LOGO_URL || LogoSrc
    const appName = import.meta.env.VITE_APP_NAME || '管理后台'

    return () => {
      return h(
        'div',
        {
          class: [
            'h-[60px] flex flex-shrink-0 items-center justify-between',
            isVertical.value && 'w-[249px] border-b-1 border-b-solid border-b-[var(--el-border-color)]',
            isHorizontal.value && 'w-[201px] border-r-1 border-r-solid border-r-[var(--el-border-color)]',
            isVertical.value && layoutStore.isCollapsed && 'w-[64px]',
          ],
        },
        [
          h(
            ElLink,
            {
              class: { 'hidden!': isVertical.value && layoutStore.isCollapsed },
              underline: false,
              onClick: () => router.replace('/'),
            },
            () => h(ElImage, { class: 'w-[200px]', src, title: appName, fit: 'contain' }),
          ),
          isVertical.value && h(
            ElIcon,
            {
              class: 'flex-1 cursor-pointer',
              size: 24,
              onClick: layoutStore.toggleCollapse,
            },
            () => h('i', { class: layoutStore.isCollapsed ? 'i-ep:expand' : 'i-ep:fold' }),
          ),
        ],
      )
    }
  },
})
