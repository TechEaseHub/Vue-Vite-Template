import type { RouteRecordRaw } from 'vue-router'
import LayoutMenu from './Menu'

export default defineComponent({
  name: 'LayoutMenu',
  props: {
    /** 当前路由对象 */
    route: {
      type: Object as PropType<RouteRecordRaw>,
      required: true,
    },
  },
  setup({ route: { path, name, meta, children } }) {
    const icon = meta?.icon
    const title = meta?.title

    return () => {
      switch (children?.length) {
        case 0 || undefined:
          return h(
            ElMenuItem,
            { index: path },
            {
              default: () => h(ElIcon, () => h('i', { class: icon ?? 'i-ep:document' })),
              title: () => title || name,
            },
          )

        case 1:
          return h(
            ElMenuItem,
            { index: children![0].path },
            {
              default: () => h(ElIcon, () => h('i', { class: icon ?? 'i-ep:document' })),
              title: () => children![0].meta?.title || children![0].name,
            },
          )

        default:
          return h(
            ElSubMenu,
            { index: path },
            {
              default: () => {
                return children?.map((child) => {
                  return h(LayoutMenu, { route: child })
                })
              },
              title: () => [
                h(ElIcon, () => h('i', { class: icon ?? 'i-ep:folder' })),
                h('span', title || name as string),
              ],
            },
          )
      }
    }
  },

})
