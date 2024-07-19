<script setup lang="ts">
import { attributes, crudOptions } from '.'
import { CrudActionArea, CrudDrawer, CrudSearchForm, CrudTable } from '@/components/A-Crud'

const { FormStore: { searchForm, editForm } } = crudOptions

definePage({
    path: '/example/custom',
    meta: {
        title: '自定义实现',
        icon: 'i-clarity:dashboard-line',
    },
})
</script>

<template>
    <div id="ElCrud" class="rounded-10 bg-[var(--el-bg-color)] p-20">
        <CrudDrawer v-model="editForm" :crud-options="crudOptions" :attrs="attributes.attrs" />
        <CrudSearchForm v-model="searchForm" :crud-options="crudOptions" :attrs="attributes.attrs" />

        <CrudActionArea :crud-options="crudOptions" />

        <CrudTable :crud-options="crudOptions" :attrs="attributes.attrs" />
    </div>
</template>

<style scoped lang="scss">

</style>
