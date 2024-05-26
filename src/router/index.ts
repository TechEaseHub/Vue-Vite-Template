import { createRouter, createWebHashHistory } from 'vue-router'

import type { RouteRecordRaw } from 'vue-router'

// console.time('router')
const pages: Record<string, RouteConfig> = import.meta.glob(['../views/**/page.ts', '!../views/components/**/page.ts'], { eager: true, import: 'default' })

const pageComps = import.meta.glob(['../views/**/index.vue', '!../views/components/**/index.vue'], { import: 'default' })

/**
 * 生成路由配置数组。
 * 首先动态导入所有匹配 ` ../views/xx/page.ts  ` 路径的页面组件，并将其映射到一个记录对象中。
 * 再动态导入所有匹配 ` ../views/xx/index.vue  ` 路径的页面对应的Vue组件。
 * 最后，根据页面路径和组件路径生成一个路由记录数组。
 *
 * @returns {RouteRecordRaw[]} 返回一个包含路由配置的对象数组。
 */
const routes = Object.entries(pages).map(([page, options]): RouteRecordRaw => {
    // 替换路径中的固定字符串，以构建路由的path值
    const path = page.replace('../views', '').replace('/page.ts', '') || '/'
    // 从路径中解析出name值，使用'-'作为分隔符，并为根路径默认使用'index'
    const name = path.split('/').filter(Boolean).join('-') || 'index'
    // 将页面路径中的'page.ts'替换为'index.vue'，以匹配对应的Vue组件
    const compPath = page.replace('page.ts', 'index.vue')

    return {
        path,
        name,
        component: pageComps[compPath], // 将组件路径映射到路由记录的component属性
        meta: options.meta, // 将页面配置中的meta信息映射到路由记录的meta属性
    }
})
// console.timeEnd('router')

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            redirect: 'Index',
            component: () => import('@/layout/index.vue'),
            children: routes,
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('@/views/login/index.vue'),
        },
        {
            path: '/:pathMatch(.*)*',
            name: 'NotFound',
            component: () => import('@/views/404.vue'),
        },
    ],
})

// console.time('nestedRoutes')
/** 嵌套路由 */
const nestedRoutes = buildNestedRoutes(routes)
// console.timeEnd('nestedRoutes')

/** 构建嵌套路由 */
function buildNestedRoutes(routes: RouteRecordRaw[]) {
    const routeMap = new Map<string, RouteRecordRaw>()
    routes.forEach(item => routeMap.set(item.path, { ...item, children: [] }))

    const routesDese = routes.sort((a, b) => {
        if (a.meta && b.meta)
            return (b.meta.menuOrder || 0) - (a.meta.menuOrder || 0)
        return 0
    })

    routesDese.forEach((route) => {
        const path = route.path
        if (path !== '/') {
            const pathParts = path.split('/')

            if (pathParts.length > 2) {
                pathParts.pop()
                const pathParent = pathParts.join('/')

                if (routeMap.has(pathParent)) {
                    const parent = routeMap.get(pathParent)!
                    parent.children!.unshift(routeMap.get(path)!)

                    routeMap.set(pathParent, parent)
                    routeMap.delete(path)
                }
                else {
                    console.error(`路由配置不存在，请检查：${pathParent}/page.ts 文件`)
                }
            }
        }
    })

    const buildRoutes: RouteRecordRaw[] = []
    routeMap.forEach(item => buildRoutes.push(item))
    buildRoutes.sort((a, b) => {
        if (a.meta && b.meta)
            return (a.meta.menuOrder || 0) - (b.meta.menuOrder || 0)
        return 0
    })

    return buildRoutes
}

export {
    router,
    routes,
    nestedRoutes,
}
