<script setup lang="ts">
definePage({
  redirect: '/example/one',
  meta: {
    title: '示例',
  },
})
</script>

<template>
  <!-- 想要缓存，就必须每一个都要写 -->
  <RouterView v-slot="{ Component, route }">
    <keep-alive :max="10">
      <component :is="Component" :key="route.name" />
    </keep-alive>
  </RouterView>
</template>
