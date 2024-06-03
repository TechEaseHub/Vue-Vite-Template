// 自定义路由元信息接口
interface CustomizeRouteMeta extends Record<string | number | symbol, unknown> {
    /** 标题 */
    title?: string
    /** 图标 */
    icon?: string
    /** 菜单排序 */
    order?: number
}

// 路由配置接口
interface RouteConfig {
    /** 路由信息 */
    meta?: CustomizeRouteMeta
    /** 重定向到子路由的路径 */
    redirect?: string
}

// 使用 glob 模式导入文件列表
type Pages = Record<string, { default?: RouteConfig }>
type PageComps = Record<string, () => Promise<unknown>>

// 扩展 vue-router 的 RouteMeta 接口
declare module 'vue-router' {
    interface RouteMeta extends CustomizeRouteMeta {}
}

export type { RouteConfig, CustomizeRouteMeta, Pages, PageComps }
