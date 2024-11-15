<script setup lang="ts">
import { useDark } from '@vueuse/core'

import { h } from 'vue'

const layoutStore = useLayoutStore()
const loginStore = useLoginStore()

const isDark = useDark()
</script>

<template>
  <div class="UserMenu h-[60px]" flex="~ items-center">
    <div @click="layoutStore.setLayoutMode('vertical')">
      <el-icon :size="20">
        <i class="i-mingcute:layout-left-line" />
      </el-icon>
    </div>
    <div @click="layoutStore.setLayoutMode('horizontal')">
      <el-icon :size="20">
        <i class="i-mingcute:layout-top-line" />
      </el-icon>
    </div>
    <div @click="layoutStore.setLayoutMode('mix')">
      <el-icon :size="20">
        <i class="i-mingcute:layout-11-line" />
      </el-icon>
    </div>

    <div>
      <el-icon :size="40" class="text-[var(--el-color-info)]">
        <i class="i-ic:baseline-account-circle" />
      </el-icon>
      <span>Admin</span>
    </div>

    <div>
      <el-switch v-model="isDark" inline-prompt size="large" :active-action-icon="h('i', { class: ['i-ep:sunny'] })" :inactive-action-icon="h('i', { class: ['i-ep:moon'] })" style="--el-switch-off-color: #000" />
    </div>

    <div @click="loginStore.logout">
      <el-icon size="20px">
        <i class="i-clarity:settings-line" />
      </el-icon>
    </div>
  </div>
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
</style>
