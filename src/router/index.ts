import { createRouter, createWebHashHistory } from 'vue-router'

declare module 'vue-router' {
    interface RouteMeta {
        /** 图标 */
        icon?: string
        /** 标题 */
        title?: string
        /** 菜单排序 */
        order?: number
        /** 在菜单中隐藏 */
        hideInMenu?: boolean
        /** 需要权限 */
        auth?: string[]
    }

}

const router = createRouter({
    history: createWebHashHistory(), // createWebHashHistory createWebHistory
    routes: [
        {
            path: '/login',
            name: 'Login',
            component: () => import('@/views/public/login.vue'),
        },
        {
            path: '/error',
            name: 'Error',
            redirect: '/404',
            meta: { title: '异常页面', hideInMenu: true },
            children: [
                {
                    path: '/403',
                    name: 'Error403',
                    component: () => import('@/views/public/error-page/403.vue'),
                    meta: { title: '403' },
                },
                {
                    path: '/404',
                    name: 'Error404',
                    component: () => import('@/views/public/error-page/404.vue'),
                    meta: { title: '404' },
                },
                {
                    path: '/500',
                    name: 'Error500',
                    component: () => import('@/views/public/error-page/500.vue'),
                    meta: { title: '500' },
                },
            ],
        },
        {
            path: '/:pathMatch(.*)*',
            name: 'NotFound',
            redirect: '/404',
        },
    ],
})

// 路由白名单，不需要登录即可访问
const WHITE_LIST = ['/login', '/question']
router.beforeEach((to, from) => {
    NProgress.start()

    // console.log('路由守卫：', {
    //     toPath: to.path,
    //     redirectedFrom: !!to.redirectedFrom,
    //     to,
    //     from,
    // })

    const { path, meta: { auth } } = to

    const userStore = useUserStore()
    const { isLogin, isAddRoute } = storeToRefs(userStore)
    const { isAuth, addRoute } = userStore

    // GitHub 无法使用代理，故移除登录认证
    if (!isAddRoute.value) {
        isAddRoute.value = true
        addRoute()

        if (to.path === '/404' && to.redirectedFrom)
            return { path: to.redirectedFrom.fullPath, replace: true } // 重新导航到重定向之前的路径

        return { ...to, replace: true } // 动态添加路由后，重新导航
    }
    return
    // GitHub 无法使用代理，故移除登录认证

    if (isLogin.value) {
        if (path === '/login')
            return from // 阻止导航，保持在当前页面

        if (!isAuth(auth))
            return { path: '/403' } // 没有权限访问，跳转403

        if (!isAddRoute.value) {
            isAddRoute.value = true
            addRoute()

            if (to.path === '/404' && to.redirectedFrom)
                return { path: to.redirectedFrom.fullPath, replace: true } // 重新导航到重定向之前的路径

            return { ...to, replace: true } // 动态添加路由后，重新导航
        }

        return // 已登录且已添加动态路由，直接继续导航
    }

    if (WHITE_LIST.includes(path))
        return // 白名单页面直接放行

    return { path: '/login' } // 未登录且非白名单，重定向到登录页
})

router.afterEach((to) => {
    document.title = `${to.meta.title || '页面'}  |  ${import.meta.env.VITE_APP_NAME}`

    NProgress.done()
})

export { router }
