import type { RouteRecordRaw } from 'vue-router'
import Menu from './Menu'

export default defineComponent({
    name: 'Menu',
    props: {
        /** 当前路由对象 */
        route: {
            type: Object as PropType<RouteRecordRaw>,
            required: true,
        },
    },
    setup({ route }) {
        const { path, meta } = route
        const title = meta?.title
        const icon = meta?.icon

        const one = () => {
            if (route.children?.length === 0) {
                return h(
                    ElMenuItem,
                    {
                        index: path,
                    },
                    {
                        default: () => h(ElIcon, () => h('i', { class: icon })),
                        title: () => `${title}`,
                    },
                )
            }
            else {
                return h(
                    ElSubMenu,
                    {
                        index: path,
                    },
                    {
                        default: () => {
                            return route.children?.map((child) => {
                                return h(Menu, { route: child })
                            })
                        },
                        title: () => [h(ElIcon, () => h('i', { class: icon })), h('span', title)],
                    },
                )
            }
        }

        return () => {
            return one()
        }
    },

})
