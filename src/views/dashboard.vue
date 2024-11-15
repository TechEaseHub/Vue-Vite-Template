<script setup lang="ts">
definePage({
  alias: ['/', '/dashboard', '/home'],
  redirect: '/dashboard/home',
  meta: {
    title: '首页',
    icon: 'i-ep:menu',
    order: -99,
  },
})
</script>

<template>
  <RouterView v-slot="{ Component, route }">
    <keep-alive :max="10">
      <component :is="Component" :key="route.name" />
    </keep-alive>
  </RouterView>
</template>
