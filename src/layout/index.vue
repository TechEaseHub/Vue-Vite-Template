<script setup lang="ts">
import LayoutLogo from './src/Logo'
import LayoutMenu from './src/Menu'
import UserMenu from './src/UserMenu.vue'

const { height } = useWindowSize()

const router = useRouter()
const layoutStore = useLayoutStore()
const routerStore = useRouterStore()

const defaultActiveRoute = computed(() => router.currentRoute.value.path)
const firstLevelPath = computed(() => `/${router.currentRoute.value.path.split('/')[1]}`)

const verticalMenu = computed(() => {
  if (layoutStore.layoutMode === 'mix') {
    const findRouter = routerStore.sortRoutes.find(item => item.path === firstLevelPath.value)
    return findRouter ? findRouter.children?.length ? findRouter.children : [findRouter] : []
  }
  return routerStore.sortRoutes
})
const horizontalMenu = computed(() => routerStore.sortRoutes)
</script>

<template>
  <el-container class="layout-container" :style="{ height: `${height}px` }">
    <el-aside
      v-if="['vertical', 'mix'].includes(layoutStore.layoutMode)"
      :width="layoutStore.isCollapsed ? '65px' : '250px'" class="no-select"
      border="r-1 r-solid r-[var(--el-border-color)]"
    >
      <LayoutLogo mode="vertical" />

      <el-menu
        class="border-none!" mode="vertical" :collapse="layoutStore.isCollapsed"
        :default-active="defaultActiveRoute" :collapse-transition="false" unique-opened router
      >
        <LayoutMenu v-for="item in verticalMenu" :key="item.path" :route="item" />
      </el-menu>
    </el-aside>

    <el-container :style="{ minWidth: '1250px' }">
      <el-header
        class="flex items-center justify-between overflow-hidden no-select"
        border="b-1 b-solid b-[var(--el-border-color)]"
      >
        <LayoutLogo v-if="layoutStore.layoutMode === 'horizontal'" mode="horizontal" />

        <el-menu
          v-if="['horizontal', 'mix'].includes(layoutStore.layoutMode)" class="flex-grow-1 border-none!"
          mode="horizontal" :default-active="defaultActiveRoute" router
        >
          <LayoutMenu v-for="item in horizontalMenu" :key="item.path" :route="item" />
        </el-menu>
        <div v-else />

        <UserMenu />
      </el-header>
      <el-main class="bg-[var(--el-color-info-light-9)]">
        <div class="h-full flex flex-col">
          <RouterView v-slot="{ Component, route }">
            <keep-alive :max="10">
              <component :is="Component" :key="route.name" />
            </keep-alive>
          </RouterView>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>
