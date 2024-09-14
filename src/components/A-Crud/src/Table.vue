<script setup lang="ts" generic="T extends BaseRow ">
import { h } from 'vue'

import type { TableColumnCtx } from 'element-plus'
import type { BaseRow, CrudOptions } from '../hooks/index.types'

const crudOptions = inject('crudOptions') as CrudOptions<BaseRow>

const {
    config: { source: { definitions }, attrs, rowKey, buttonAuth, table },
    tableStores: {
        loading,
        tableData,
        tableColumns,
        page: { currentPage, pageSize, total, pageSizes, layout },
    },
    actionHandler: { Query, Edit, Remove },
} = crudOptions

/** 表格 select 参数 格式化 */
function formatColumn<T extends BaseRow>(row: T, column: TableColumnCtx<T>) {
    // console.log('###', { row, column, cellValue, index })
    const prop = column.rawColumnKey as keyof BaseRow

    // 获取列属性值
    let cellValue = row[prop]

    // 获取列属性中的组件属性中配置的 options
    const options = definitions[prop]?.componentProps?.options as { value: number, label: string }[]

    if (options) {
        const item = options.find(option => option.value === row[prop])

        if (item)
            cellValue = item.label
    }

    return cellValue
}

/** 单元格双击事件（复制到剪贴板） */
function cellDblclick(_row: any, column: any, cell: any, _event: any) {
    const { label } = column
    // 检查浏览器是否支持clipboard API
    if (navigator.clipboard) {
        // 将文本写入剪贴板
        label
        && cell?.textContent
        && navigator.clipboard
            .writeText(cell?.textContent)
            .then(() => {
                ElMessage({ type: 'success', message: '复制成功！', grouping: true })
            })
            .catch((error) => {
                console.error('写入剪贴板时出错：', error)
            })
    }
    else {
        console.warn('该浏览器不支持clipboard API')
    }
}

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
            element-loading-text="查询中..." :data="tableData"
            :row-key="rowKey" show-overflow-tooltip border
            :height="495"
            :header-cell-style="{ height: '45px', background: 'var(--el-border-color)' }"
            :tooltip-options="{
                placement: 'top-end',
                popperClass: 'custom-tooltip',
            }"
            @cell-dblclick="cellDblclick"
            v-bind="attrs.table"
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

            <el-table-column v-for="key in tableColumns" :key="key" :label="definitions[key]?.label" :prop="key" :min-width="110" :formatter="formatColumn" v-bind="definitions[key]?.tableProps">
                <template #default="scope">
                    <component :is="definitions[key]?.render?.({ ...scope, crudOptions })" />
                </template>
            </el-table-column>

            <!-- 自定义插槽列 -->
            <slot name="column" />

            <el-table-column v-if="table.menuVisible" label="操作" :width="table.menuWidth" :align="table.menuAlign">
                <template #default="scope">
                    <slot name="top" v-bind="scope" />
                    <slot name="menu" v-bind="scope">
                        <template v-if="scope.row.deleteFlag === 0">
                            <el-link v-if="buttonAuth.edit" @click="Edit(scope.row)" type="primary" :icon="h('i', { class: 'i-ep:edit' })">
                                编辑
                            </el-link>
                            <el-link v-if="buttonAuth.delete" @click="Remove(scope.row)" type="danger" :icon="h('i', { class: 'i-ep:delete' })">
                                删除
                            </el-link>
                        </template>
                    </slot>
                    <slot name="bottom" v-bind="scope" />
                </template>
            </el-table-column>
        </el-table>
    </div>

    <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="pageSizes"
        :layout="layout"
        background
        @size-change="sizeChange"
        @current-change="currentChange"
        v-bind="attrs.pagination"
    />
</template>

<style scoped lang="scss">
// 单元格高度写死
:deep(.el-table__row) {
    height: 45px;
}
// el-table-column 操作列中的链接添加间距
.el-link + .el-link {
    margin-left: 12px;
}
// 表格自定义append中添加取消按钮 !!!未启用
.cancelBut {
    position: absolute;
    top: 60%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 99999;
}

/* 在你的样式文件中 */
:deep(.custom-tooltip) {
    max-width: 500px;
}
</style>
