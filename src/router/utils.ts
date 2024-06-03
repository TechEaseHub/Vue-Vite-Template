import type { PageComps, Pages } from 'types/router'
import type { RouteRecordRaw } from 'vue-router'

/**
 * 构建扁平化路由
 *
 * 这个函数接收页面和页面组件作为参数，然后构建并返回一个路由对象。
 * 根据页面路径的层级，路由对象按照从高到低的顺序排列。
 *
 * @param {Pages} pages - 页面对象，键是页面路径，值是页面模块。 使用 `import.meta.glob`
 * @param {PageComps} pageComps - 页面组件对象，键是组件路径，值是组件实例。 使用 `import.meta.glob`
 *
 * @returns {RouteRecordRaw} - 路由对象数组
 *
 * @example
 *
 * const pages = import.meta.glob([../views/xxx/page.ts], { eager: true })
 * const pageComps = import.meta.glob([../views/xxx/index.vue], { import: 'default' })
 */
function buildFlatRoutes(pages: Pages, pageComps: PageComps): RouteRecordRaw[] {
    return Object.entries(pages).sort((a, b) => {
        const getLevel = (path: string) => path.split('/').length
        return getLevel(b[0]) - getLevel(a[0])
    }).map(([page, module]) => {
        const options = module.default ?? {}

        const path = page.substring(8, page.length - 8) || '/index'
        const name = path.split('/').filter(Boolean).join('_') || 'index'
        const component = pageComps[page.replace('page.ts', 'index.vue')]
        const redirect = options.redirect ? `${path}/${options.redirect}` : undefined
        const meta = { ...options.meta }

        return { path, name, component, redirect, meta, children: [] }
    })
}

/**
 * 构建嵌套路由
 *
 * 这个函数接收扁平化路由作为参数，然后构建并返回一个嵌套路由对象。
 * 根据路由路径的层级关系，将扁平化路由转换为嵌套路由。
 *
 * @param {RouteRecordRaw[]} FlatRoutes - 扁平化路由数组
 *
 * @returns {RouteRecordRaw[]} - 嵌套路由对象数组
 */
function buildNestedRoutes(FlatRoutes: RouteRecordRaw[]): RouteRecordRaw[] {
    const buildRoutes: RouteRecordRaw[] = []
    const RouterMap = new Map<string, RouteRecordRaw>()

    FlatRoutes.forEach(route => RouterMap.set(route.path, { ...route, children: [] }))
    RouterMap.forEach((route) => {
        const parentRoutePath = route.path.split('/').slice(0, -1).join('/') || '/'
        const parentRoute = RouterMap.get(parentRoutePath)

        if (parentRoute) {
            insertRoute(route, parentRoute.children!)
            RouterMap.delete(route.path)
        }
        else {
            insertRoute(route, buildRoutes)
        }
    })

    return buildRoutes
}

/**
 * 插入路由（辅助函数）
 *
 * 这个函数将给定的路由对象插入到指定的路由数组中，根据路由的元数据中的顺序属性进行排序。
 *
 * @param {RouteRecordRaw} route - 要插入的路由对象
 * @param {RouteRecordRaw[]} routes - 路由数组
 *
 * @returns {void}
 */
function insertRoute(route: RouteRecordRaw, routes: RouteRecordRaw[]): void {
    const order = route.meta?.order || 0
    let inserted = false
    let j = 0
    const len = routes.length
    while (j < len) {
        const currentRoute = routes[j]
        const currentOrder = currentRoute.meta?.order || 0
        if (currentOrder > order || (currentOrder === order && currentRoute.path > route.path)) {
            routes.splice(j, 0, route)
            inserted = true
            break
        }
        j++
    }
    if (!inserted)
        routes.push(route)
}

export { buildFlatRoutes, buildNestedRoutes }
