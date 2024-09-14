<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'

import Logo from './Logo'
import Menu from './Menu'
import UserMenu from './UserMenu.vue'

const router = useRouter()
const { height } = useWindowSize()

const { isCollapse, layoutMode } = storeToRefs(LayoutStore())
const { sortRoutes } = storeToRefs(useRouterStore())

const DefaultActive = computed(() => router.currentRoute.value.path)

const verticalMenu = computed(() => {
    if (layoutMode.value === 'mix') {
        const firstLevelPath = `/${router.currentRoute.value.path.split('/')[1]}`
        const findRouter = sortRoutes.value.find(item => item.path === firstLevelPath)
        return findRouter ? findRouter.children?.length ? findRouter.children : [findRouter] : []
    }

    return sortRoutes.value
})
const horizontalMenu = computed(() => sortRoutes.value)
</script>

<template>
    <el-container class="layout-container" :style="{ height: `${height}px` }">
        <el-aside v-if="['vertical', 'mix'].includes(layoutMode)" :width="isCollapse ? '65px' : '250px'" class="no-select" border="r-1 r-solid r-[var(--el-border-color)]">
            <Logo mode="vertical" />

            <el-menu class="border-none!" mode="vertical" :collapse="isCollapse" :default-active="DefaultActive" :collapse-transition="false" unique-opened router>
                <Menu v-for="item in verticalMenu" :key="item.path" :route="item" />
            </el-menu>
        </el-aside>

        <el-container :style="{ minWidth: '1250px' }">
            <el-header class="flex items-center justify-between overflow-hidden no-select" border="b-1 b-solid b-[var(--el-border-color)]">
                <Logo v-if="layoutMode === 'horizontal'" mode="horizontal" />

                <el-menu v-if="['horizontal', 'mix'].includes(layoutMode)" class="flex-grow-1 border-none!" mode="horizontal" :default-active="DefaultActive" router>
                    <Menu v-for="item in horizontalMenu" :key="item.path" :route="item" />
                </el-menu>
                <div v-else />

                <UserMenu />
            </el-header>
            <!-- flex! flex-1 -->
            <el-main class="bg-[var(--el-color-info-light-9)]">
                <div class="h-full flex flex-col">
                    <RouterView />
                    <!-- <RouterView v-slot="{ Component }">
                        <KeepAlive>
                            <component :is="Component" />
                        </KeepAlive>
                    </RouterView> -->
                </div>
            </el-main>
        </el-container>
    </el-container>
</template>

<style scoped lang="scss">

</style>
