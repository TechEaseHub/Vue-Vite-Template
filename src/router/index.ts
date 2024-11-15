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
      component: () => import('@views/public/login.vue'),
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
          component: () => import('@views/public/error-page/403.vue'),
          meta: { title: '403' },
        },
        {
          path: '/404',
          name: 'Error404',
          component: () => import('@views/public/error-page/404.vue'),
          meta: { title: '404' },
        },
        {
          path: '/500',
          name: 'Error500',
          component: () => import('@views/public/error-page/500.vue'),
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

router.beforeEach((to, from) => {
  NProgress.start()

  // console.log('路由守卫：', {
  //   toPath: to.path,
  //   redirectedFrom: !!to.redirectedFrom,
  //   to,
  //   from,
  // })

  return useRouterStore().handleRouteGuard(to, from)
})

router.afterEach((to) => {
  document.title = `${to.meta.title || '页面'}  |  ${import.meta.env.VITE_APP_NAME}`

  NProgress.done()
})

export { router }
