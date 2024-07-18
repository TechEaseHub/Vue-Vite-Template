import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

import { routes } from 'vue-router/auto-routes'

const nestedRoutes: RouteRecordRaw[] = sortRoutesByOrder(routes)

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            component: () => import('@/layout/index.vue'),
            children: routes,
        },
        {
            path: '/login',
            name: 'Login',
            component: () => import('@/views/public/login.vue'),
        },
        {
            path: '/:pathMatch(.*)*',
            name: 'NotFound',
            component: () => import('@/views/public/404.vue'),
        },
    ],
})

function sortRoutesByOrder(routes: RouteRecordRaw[]): RouteRecordRaw[] {
    // 对当前层级的路由进行排序
    routes.sort((a, b) => {
        // 使用可选链和空值合并运算符来安全地获取 order 值
        const orderA = a.meta?.order ?? 0
        const orderB = b.meta?.order ?? 0
        return orderA - orderB
    })

    // 递归地对每个子路由数组进行排序
    routes.forEach((route) => {
        if (route.children && Array.isArray(route.children))
            sortRoutesByOrder(route.children) // 直接修改子路由数组，因为我们已经传入了引用
    })

    // 注意：这个函数直接修改了传入的数组。如果你不希望修改原数组，
    // 请在函数开始时创建一个数组的副本，并在副本上进行操作。

    // 由于我们没有创建新数组，因此返回原始数组引用也是可以的，
    // 但为了清晰起见，这里还是显式返回它。
    return routes
}

export { router, routes, nestedRoutes }
