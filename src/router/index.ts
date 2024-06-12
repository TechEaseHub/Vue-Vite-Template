import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

import type { PageComps, Pages } from 'types/router'
import { buildFlatRoutes, buildNestedRoutes } from './utils'

const pages: Pages = import.meta.glob(['../views/**/page.ts', '!../views/components/**/page.ts'], { eager: true })

const pageComps: PageComps = import.meta.glob(['../views/**/index.vue', '!../views/components/**/index.vue'], { import: 'default' })

const FlatRoutes = buildFlatRoutes(pages, pageComps)

const routes: RouteRecordRaw[] = FlatRoutes.filter(route => route.component)
const nestedRoutes: RouteRecordRaw[] = buildNestedRoutes(FlatRoutes)

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            redirect: '/index',
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

export {
    router,
    routes,
    nestedRoutes,
}
