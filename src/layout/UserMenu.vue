<script setup lang="ts">
import { h } from 'vue'

import { useDark } from '@vueuse/core'

const layoutStore = LayoutStore()

const isDark = useDark()
</script>

<template>
    <div class="UserMenu h-60" flex="~ items-center">
        <div @click="layoutStore.SetLayoutMode('vertical')">
            <el-icon size="20px">
                <i class="i-mingcute:layout-left-line" />
            </el-icon>
        </div>
        <div @click="layoutStore.SetLayoutMode('horizontal')">
            <el-icon size="20px">
                <i class="i-mingcute:layout-top-line" />
            </el-icon>
        </div>
        <div @click="layoutStore.SetLayoutMode('mix')">
            <el-icon size="20px">
                <i class="i-mingcute:layout-11-line" />
            </el-icon>
        </div>

        <div>
            <el-icon size="40px" class="text-[var(--el-color-info)]">
                <i class="i-ic:baseline-account-circle" />
            </el-icon>
            <span>Admin</span>
        </div>

        <div>
            <el-switch v-model="isDark" inline-prompt size="large" :active-action-icon=" h('i', { class: ['i-ep:sunny'] })" :inactive-action-icon=" h('i', { class: ['i-ep:moon'] })" style="--el-switch-off-color: #000" />
        </div>

        <div>
            <el-icon size="20px">
                <i class="i-clarity:settings-line" />
            </el-icon>
        </div>
    </div>

    <!-- <Setting ref="SettingRef" /> -->
    <!-- <changePassWd ref="changePassWdRef" /> -->
</template>

<style lang="scss" scoped>
.UserMenu {
    > * {
        padding: 0 12px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        &:hover {
            height: 100%;
            background-color: var(--el-menu-hover-bg-color);
        }
    }
}
// :deep(.el-dropdown-menu__item) {
//     justify-content: center;
// }
// .item {
//     height: 100%;
//     display: flex;
//     align-items: center;
//     padding: 0 var(--el-menu-base-level-padding);
//     font-size: var(--el-menu-item-font-size);
//     cursor: pointer;
//     box-sizing: border-box;
//     white-space: nowrap;
//     &:hover {
//         background-color: var(--el-menu-hover-bg-color);
//     }
// }
</style>
