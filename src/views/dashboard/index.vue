<script setup lang="ts">
/**
 * index.vue 配置了 path
 * 那么 FilterRoutes 函数中的 `child.path === ''` 就不会匹配
 * 就只会找寻 `meta.isMenu` 路由来添加到父路由信息
 */
definePage({
  path: '/dashboard',
  meta: {
    title: '仪表盘',
    icon: 'i-clarity:dashboard-line',
    order: -99,
  },
})
</script>

<template>
  <div class="div-c">
    仪表盘
  </div>
</template>

<style scoped lang="scss">

</style>
