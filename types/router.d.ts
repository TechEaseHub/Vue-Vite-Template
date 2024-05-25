declare global {

    interface CustomizeRouteMeta extends Record<string | number | symbol, unknown> {
        /** 标题 */
        title: string
        /** 图标 */
        icon?: string
        /** 菜单排序 */
        menuOrder?: number
    }

    interface RouteConfig {
        /** 路由信息 */
        meta: CustomizeRouteMeta
    }
}

// https://router.vuejs.org/zh/guide/advanced/meta.html#typescript
declare module 'vue-router' {
    interface RouteMeta extends CustomizeRouteMeta { }
}

export {}
