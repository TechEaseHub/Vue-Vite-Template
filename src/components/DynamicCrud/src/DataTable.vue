<script setup lang="ts" generic="T extends BaseRow">
import type { TableColumnCtx } from 'element-plus'
import type { BaseRow, DynamicStoreReturnType } from '..'

import { h } from 'vue'

defineOptions({ name: 'DataTable' })

const DynamicStore = inject<DynamicStoreReturnType<T>>('DynamicStore')!
const { configStore, tableStore, actionHandler } = DynamicStore

const { source, attrs, rowKey, rowKeys, table, buttonAuth } = storeToRefs(configStore)
const { loading, tableData, tableColumns, currentPage, pageSize, total, pageSizes, layout } = storeToRefs(tableStore)
const { Query, Edit, Remove } = actionHandler

const RowKey = computed(() => rowKey.value || (rowKeys.value?.[0] ?? undefined))

const tableAttributes = computed(() => ({
  ...{
    height: 495,
    showOverflowTooltip: true,
    border: true,
    headerCellStyle: {
      height: '45px',
      background: 'var(--el-border-color)',
    },
    tooltipOptions: {
      placement: 'top-end',
      popperClass: 'custom-tooltip',
    },
  },
  ...attrs.value.table,
}))

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

/** 表格 select 参数 格式化 */
function formatColumn<T extends BaseRow>(row: T, column: TableColumnCtx<T>) {
  // console.log('###', { row, column, cellValue, index })
  const prop = column.rawColumnKey as keyof BaseRow

  // 获取列属性值
  let cellValue = row[prop]

  // 获取列属性中的组件属性中配置的 options
  const options = source.value.definitions[prop]?.componentProps?.options as { value: number, label: string }[]

  if (options) {
    const matchedOption = options.find(option => option.value === row[prop])

    if (matchedOption)
      cellValue = matchedOption.label
  }

  return cellValue
}

/** 当前页改变 */
function currentChange(value: number) {
  currentPage.value = value
  // Tip: 请求异常会没有分页对象，就会为 null 会触发页码改变事件，所以没有值时直接 return
  if (currentPage.value == null)
    return
  Query()
}
/** 分页大小改变 */
function sizeChange(value: number) {
  pageSize.value = value
  Query()
}
</script>

<template>
  <div class="py-[18px]">
    <el-table
      v-loading="loading"
      :data="tableData"
      :row-key="RowKey"
      v-bind="tableAttributes"
      @cell-dblclick="cellDblclick"
    >
      <!-- 空状态 -->
      <template #empty>
        <el-empty description="暂无数据" />
      </template>

      <!-- 动态渲染表格列 -->
      <el-table-column
        v-for="key in tableColumns" :key="key"
        :label="source.definitions[key]?.label" :prop="key" :min-width="110"
        :formatter="formatColumn"
        v-bind="source.definitions[key]?.tableProps"
      >
        <template #default="scope">
          <!-- 表格列自定义渲染 -->
          <component :is="source.definitions[key]?.render?.(scope, DynamicStore)" />
        </template>
      </el-table-column>

      <!-- 自定义插槽列 -->
      <slot name="table-column" />

      <!-- 操作菜单 -->
      <el-table-column v-if="table.menuVisible" label="操作" :width="table.menuWidth" :align="table.menuAlign">
        <template #default="scope">
          <slot name="menu-top" v-bind="scope" />
          <slot name="menu" v-bind="scope">
            <el-link v-if="buttonAuth.edit" type="primary" :icon="h('i', { class: 'i-ep:edit' })" @click="Edit(scope.row)">
              编辑
            </el-link>
            <el-link v-if="buttonAuth.delete" type="danger" :icon="h('i', { class: 'i-ep:delete' })" @click="Remove(scope.row)">
              删除
            </el-link>
          </slot>
          <slot name="menu-bottom" v-bind="scope" />
        </template>
      </el-table-column>
    </el-table>
  </div>

  <!-- 分页配置 -->
  <el-pagination
    v-model:current-page="currentPage"
    v-model:page-size="pageSize"
    :total="total"
    :page-sizes="pageSizes"
    :layout="layout"
    background
    v-bind="attrs.pagination"
    @current-change="currentChange"
    @size-change="sizeChange"
  />
</template>

<style scoped lang="scss">
// Tip: 单元格高度写死
:deep(.el-table__row) {
  height: 45px !important;
}

// Tip: el-table-column 操作列中的链接添加间距
.el-link + .el-link {
  margin-left: 12px;
}

// Tip: 固定 tooltip 最大高度样式
:deep(.custom-tooltip) {
  max-width: 500px;
}
</style>
