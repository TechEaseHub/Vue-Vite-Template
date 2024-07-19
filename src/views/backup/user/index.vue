<script setup lang="ts">
import { attributes } from '.'

definePage({
    meta: {
        title: '用户管理',
        icon: 'i-clarity:dashboard-line',
        order: 1,
    },
})
</script>

<template>
    <ACrud v-bind="attributes" />
</template>

<style scoped lang="scss">

</style>
