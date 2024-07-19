<script setup lang="ts" generic="T extends { [key: string]: any }">
import { CrudActionArea, CrudDrawer, CrudSearchForm, CrudTable, InitCrudOptions, useTableHeight } from '.'
import type { Props } from '.'

const { source, apiConfig, hooks } = defineProps<Props<T>>()

const emit = defineEmits(['searchFormChange', 'editFormChange'])

const ElCrud = ref<HTMLElement | null>(null)
const tableHeight = useTableHeight(ElCrud.value)

const crudOptions = InitCrudOptions<T>(source, apiConfig, hooks)
const { FormStore: { searchForm, editForm } } = crudOptions

watch(() => searchForm, (val) => {
    emit('searchFormChange', val)
}, { deep: true })

watch(() => editForm, (val) => {
    emit('editFormChange', val)
}, { deep: true })
</script>

<template>
    <div id="ElCrud" ref="ElCrud" class="rounded-10 bg-[var(--el-bg-color)] p-20">
        <CrudSearchForm v-model="searchForm" :crud-options="crudOptions" :attrs />

        <CrudActionArea :crud-options="crudOptions" />

        <CrudTable :table-height="tableHeight" :crud-options="crudOptions" :attrs />

        <CrudDrawer v-model="editForm" :crud-options="crudOptions" :attrs />
    </div>
</template>

<style lang="scss" scoped>

</style>
