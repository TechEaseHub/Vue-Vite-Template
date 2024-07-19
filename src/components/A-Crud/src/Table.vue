<script setup lang="ts" generic="T">
import { h } from 'vue'
import type { Attrs, CrudOptions } from '..'

const { crudOptions } = defineProps<{ crudOptions: CrudOptions<T>, tableHeight?: number, attrs?: Attrs }>()

const {
    source: { columns },
    TableStore: {
        loading,
        tableData,
        tableColumns,
        page: { currentPage, pageSize, total, pageSizes, layout },
    },
    ActionHandler: { Query, Edit, Remove },
} = crudOptions as CrudOptions<any>

function sizeChange(value: number) {
    pageSize.value = value
    // togglePageSizeChangeSynch(pageSize.value)
    Query()
}
function currentChange(value: number) {
    currentPage.value = value
    // 请求异常会没有分页对象，就会为 null 会触发页码改变事件，所以没有值时直接 return
    if (currentPage.value == null)
        return
    Query()
}
</script>

<template>
    <div class="py-18">
        <el-table
            v-loading="loading"
            element-loading-text="查询中..."
            :data="tableData" :crud-options="crudOptions"
            show-overflow-tooltip border :height="495"
            :header-cell-style="{ height: '45px', background: 'var(--el-border-color)' }"
            v-bind="attrs?.table"
        >
            <!-- TODO:查询请求时，表格添加取消按钮 -->
            <!-- TODO： unocss 格式化有问题，以下class类的值格式化后会消失 -->
            <!-- <template #append>
                <el-button v-if="loading" class="cancelBut">
                    取消
                </el-button>
            </template> -->

            <template #empty>
                <el-empty description="暂无数据" />
            </template>

            <template v-for="key in new Set(tableColumns)" :key="key">
                <el-table-column :label="columns[key].label" :prop="key" v-bind="columns[key].tableProps">
                    <template #default="scope">
                        <component :is="columns[key].render?.({ ...scope, crudOptions })" />
                    </template>
                </el-table-column>
            </template>

            <el-table-column label="操作" width="150" align="center">
                <template #default="{ row }">
                    <slot name="default">
                        <template v-if="row.deleteFlag === 0">
                            <el-link type="primary" :icon="h('i', { class: 'i-ep:edit' })" @click="Edit(row)">
                                编辑
                            </el-link>
                            <el-link type="danger" :icon="h('i', { class: 'i-ep:delete' })" @click="Remove(row)">
                                删除
                            </el-link>
                        </template>
                    </slot>
                </template>
            </el-table-column>
        </el-table>
    </div>

    <el-pagination
        v-model:current-page="currentPage" v-model:page-size="pageSize"
        :total="total" :page-sizes="pageSizes" :layout="layout"
        background
        @size-change="sizeChange"
        @current-change="currentChange"
    />
</template>

<style scoped lang="scss">
:deep(.el-table__row) {
    height: 45px;
}

.el-link + .el-link {
    margin-left: 12px;
}

.cancelBut {
    position: absolute;
    top: 60%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 99999;
}
</style>
