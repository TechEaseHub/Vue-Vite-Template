<script setup lang="ts">
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { routes } from 'vue-router/auto-routes'
import { router } from './router'

console.log('【APP ~ routes】\n', router.options.routes, '\n', routes)
</script>

<template>
    <ElConfigProvider
        :locale="zhCn"
        :button="{ autoInsertSpace: true }"
        :message="{ max: 3 }"
        :value-on-clear="() => undefined"
        :empty-values="[undefined, null]"
    >
        <RouterView />
    </ElConfigProvider>
</template>

<style lang="scss">

</style>
