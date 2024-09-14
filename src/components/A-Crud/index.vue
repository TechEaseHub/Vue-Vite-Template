<script setup lang="ts" generic="T extends BaseRow">
import { CrudActionArea, CrudDrawer, CrudSearchForm, CrudTable, useConfig, useCrud } from './hooks/index'

import type { ApiEndpoints, Attrs, BaseRow, ButtonAuth, CrudEmits, CrudSlots, HooksConfig, PaginationConfig, Source, TableConfig } from './hooks/index.types'

const props = defineProps<{
    /**
     * DeBug 模式
     * @default false
     */
    debug?: boolean
    /**
     * 在 onMounted 后查询
     * @default false
     */
    isAfterMountQuery?: boolean

    /**
     * 当前页网络请求根 `url`
     */
    url: string
    /**
     * 表格行数据的 Key，用来优化 Table 的渲染；
     *
     * 在使用reserve-selection功能与显示树形数据时，该属性是必填的。
     */
    rowKey?: keyof T
    /**
     * 多主键，主要用作与网络请求时多主键参数
     */
    rowKeys?: (keyof T)[]

    /**
     * CRUD 数据提供者
     */
    source: Source<T>
    /**
     * 表单、表格、分页、抽屉 组件基础配置项
     */
    attrs?: Partial<Attrs>
    /**
     * CRUD 函数执行期间钩子
     */
    hooks?: HooksConfig<T>

    /**
     * 网络请求的接口名称映射，与 `url` 进行拼接成完整的请求地址
     */
    apiEndpoints?: Partial<ApiEndpoints>
    /**
     * 操作按钮权限
     */
    buttonAuth?: Partial<ButtonAuth>

    /**
     * 表格配置
     */
    table?: Partial<TableConfig>
    /**
     * 分页配置
     */
    pagination?: Partial<PaginationConfig>
}>()
const emits = defineEmits<CrudEmits<T>>()
const slots = defineSlots<CrudSlots<T>>()

const config = useConfig(props)

const crudOptions = useCrud<T>({ config, emits, slots })
provide('crudOptions', crudOptions)

const { formStores: { searchForm, editForm } } = crudOptions
</script>

<template>
    <div class="rounded-10 bg-[var(--el-bg-color)] p-20">
        <CrudSearchForm v-model="searchForm">
            <template #form>
                <slot name="search-form" v-bind="crudOptions" />
            </template>
            <template #top>
                <slot name="search-form-top" v-bind="crudOptions" />
            </template>
            <template #bottom>
                <slot name="search-form-bottom" v-bind="crudOptions" />
            </template>
        </CrudSearchForm>

        <CrudActionArea>
            <template #left>
                <slot name="button-left" v-bind="crudOptions" />
            </template>
            <template #right>
                <slot name="button-right" v-bind="crudOptions" />
            </template>
        </CrudActionArea>

        <CrudTable>
            <template #column>
                <slot name="table-column" />
            </template>
            <template #menu="scope">
                <slot name="table-menu" v-bind="{ ...scope, ...crudOptions }" />
            </template>
            <template #top="scope">
                <slot name="table-menu-top" v-bind="{ ...scope, ...crudOptions }" />
            </template>
            <template #bottom="scope">
                <slot name="table-menu-bottom" v-bind="{ ...scope, ...crudOptions }" />
            </template>
        </CrudTable>

        <CrudDrawer v-model="editForm">
            <template #edit-form>
                <slot name="edit-form" v-bind="crudOptions" />
            </template>
            <template #top>
                <slot name="edit-form-top" v-bind="crudOptions" />
            </template>
            <template #bottom>
                <slot name="edit-form-bottom" v-bind="crudOptions" />
            </template>
        </CrudDrawer>
    </div>
</template>

<style lang="scss" scoped>

</style>
