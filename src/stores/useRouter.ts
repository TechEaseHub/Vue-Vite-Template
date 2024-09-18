import type { RouteRecordRaw } from 'vue-router'
import { routes } from 'vue-router/auto-routes'

export const useRouterStore = defineStore(
    'router',
    () => {
        const filterRoutes = computed(() => {
            const { ownRole } = storeToRefs(useUserStore())
            return FilterRoutes(routes, ownRole.value)
        })

        const sortRoutes = computed(() => sortRoutesByOrder(filterRoutes.value))

        function $reset() {

        }

        return {
            /** 权限过滤后的路由 */
            filterRoutes,
            /** 权限路由进行排序后的路由 */
            sortRoutes,

            $reset,
        }
    },
    { persist: true },
)

/**
 * 过滤路由配置，根据用户的角色和路由的元信息来确定哪些路由应该在菜单中显示
 * @param routes - 要过滤的路由配置数组，通常是由 Vue Router 的路由配置生成的
 * @param roles - 用户的角色数组，用于确定哪些路由是可访问的
 * @returns 过滤后的路由配置数组，仅包含角色数组中的路由
 */
function FilterRoutes(routes: RouteRecordRaw[], roles: string[]): RouteRecordRaw[] {
    return routes.reduce<RouteRecordRaw[]>((acc, route) => {
        const { meta = {}, children } = route
        const isHideMenu = meta.hideInMenu === true
        const requiredRoles = meta.auth || []

        // 过滤掉需要隐藏在菜单中的路由
        if (isHideMenu)
            return acc

        // 过滤掉角色不符合的路由
        if (requiredRoles.length > 0 && !roles.some(role => requiredRoles.includes(role)))
            return acc

        // 创建一个新的路由对象
        const newRoute: RouteRecordRaw = { ...route }

        // 递归处理子路由
        if (children && children.length > 0) {
            newRoute.children = FilterRoutes(children, roles)
            // 如果子路由为空，则不包括此路由
            if (newRoute.children.length === 0)
                return acc
        }

        // 将符合条件的路由添加到结果数组中
        acc.push(newRoute)
        return acc
    }, [])
}

/**
 * 根据路由的 meta.order 属性对路由进行排序，并递归地对每个子路由数组进行排序
 *
 * @param routes - 需要排序的路由数组
 * @returns 排序后的路由数组
 */
function sortRoutesByOrder(routes: RouteRecordRaw[]): RouteRecordRaw[] {
    // 使用 toSorted 方法对路由数组进行排序
    const toSortedRoutes = routes.toSorted((a, b) => {
        // 使用可选链 ?. 和空值合并运算符 ?? 来安全地获取 order 值
        // 如果 order 值不存在，默认为 0
        const orderA = a.meta?.order ?? 0
        const orderB = b.meta?.order ?? 0
        // 返回两个路由的 order 差值，用于排序
        return orderA - orderB
    })

    // 递归地对每个子路由数组进行排序
    const sortedRoutes = toSortedRoutes.map((route) => {
        // 检查 route 是否有子路由，并且子路由是一个数组
        if (route.children && Array.isArray(route.children)) {
            // 递归调用 sortRoutesByOrder 对子路由进行排序，并返回新的子路由数组
            return {
                ...route,
                children: sortRoutesByOrder(route.children), // 返回新的排序后的子路由数组
            }
        }
        return route
    })

    // 返回排序后的路由数组
    return sortedRoutes
}
