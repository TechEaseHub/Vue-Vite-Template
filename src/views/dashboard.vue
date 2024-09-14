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
    <RouterView />
</template>
