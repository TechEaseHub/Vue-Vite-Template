<script setup lang="ts">
import { useDark, useWindowSize } from '@vueuse/core'
import { h } from 'vue'
import { onBeforeRouteUpdate } from 'vue-router'

import Logo from './Logo'
import Menu from './Menu'

import { nestedRoutes, router } from '@/router'
import { LayoutStore } from '@/stores'

const { height } = useWindowSize()

const isDark = useDark()

// 获取当前 vue-router 的激活路由
// 用于 el-menu 的默认激活项
const defaultActive = ref<string>(router.currentRoute.value.path)

onBeforeRouteUpdate((to) => {
    defaultActive.value = to.path
})

const { isCollapse } = storeToRefs(LayoutStore())
</script>

<template>
    <el-container class="layout-container" :style="{ height: `${height}px` }">
        <el-aside :width="isCollapse ? '65px' : '250px'" border="r-1 r-solid r-[var(--el-border-color)]">
            <Logo mode="vertical" />

            <el-menu class="border-none!" mode="vertical" :collapse="isCollapse" :default-active="defaultActive" :collapse-transition="false" unique-opened router>
                <Menu v-for="item in nestedRoutes" :key="item.path" :route="item" />
            </el-menu>
        </el-aside>
        <!--  :style="{ minWidth: '1250px' }" -->
        <el-container :style="{ minWidth: '1250px' }">
            <el-header class="flex items-center justify-between overflow-hidden" border="b-1 b-solid b-[var(--el-border-color)]">
                <Logo mode="horizontal" />

                <el-menu class="flex-grow-1 border-none!" mode="horizontal" :default-active="defaultActive" router>
                    <Menu v-for="item in nestedRoutes" :key="item.path" :route="item" />
                </el-menu>

                <div class="px-12">
                    <el-switch v-model="isDark" inline-prompt size="large" :active-icon=" h('i', { class: ['i-ep:sunny'] })" :inactive-icon=" h('i', { class: ['i-ep:moon'] })" style="--el-switch-off-color: #000" />
                </div>
            </el-header>
            <!-- flex! flex-1 -->
            <el-main class="bg-[var(--el-color-info-light-9)]">
                <div class="flex flex-col">
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

mb-4
<style scoped lang="scss">

</style>
mb-4mb-4
