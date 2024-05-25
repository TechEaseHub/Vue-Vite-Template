<script setup lang="ts">
import { routes } from './router'

console.log(routes)
routes.sort((a, b) => (a.meta?.menuOrder || 0) - (b.meta?.menuOrder || 0))
</script>

<template>
    <div flex="~ justify-center items-center">
        <template v-for="route in routes" :key="route.path">
            <RouterLink v-if="route.component" class="m-30" :to="route.path">
                {{ route.meta?.title }}
            </RouterLink>
        </template>
    </div>
    <RouterView />
</template>

<style lang="scss">

</style>
