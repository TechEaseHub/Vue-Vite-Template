<script setup lang="ts" generic="T extends BaseRow">
import type { TableColumnCtx } from 'element-plus'
import type { BaseRow } from '../hooks/base.types'
import type { ActionHandler } from '../hooks/useActions.types'
import type { CrudConfig } from '../hooks/useConfig.types'
import type { FormStore } from '../hooks/useForm.types'
import type { TableStore } from '../hooks/useTable.types'

import { h } from 'vue'

const props = defineProps<{ config: CrudConfig<T>, actionHandler: ActionHandler<T> }>()
const formStore = defineModel<FormStore<T>>('formStore', { required: true })
const tableStores = defineModel<TableStore<T>>('tableStores', { required: true })

const config = computed(() => props.config)
const actionHandler = computed(() => props.actionHandler)
const definitions = computed(() => config.value.source.definitions)
const { tableData, tableColumns, loading, page } = tableStores.value

/** 表格 select 参数 格式化 */
function formatColumn<T extends BaseRow>(row: T, column: TableColumnCtx<T>) {
  // console.log('###', { row, column, cellValue, index })
  const prop = column.rawColumnKey as keyof BaseRow

  // 获取列属性值
  let cellValue = row[prop]

  // 获取列属性中的组件属性中配置的 options
  const options = definitions.value[prop]?.componentProps?.options as { value: number, label: string }[]

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
  page.pageSize.value = value
  actionHandler.value.Query()
}

function currentChange(value: number) {
  page.currentPage.value = value
  // 请求异常会没有分页对象，就会为 null 会触发页码改变事件，所以没有值时直接 return
  if (page.currentPage.value == null)
    return
  actionHandler.value.Query()
}
</script>

<template>
  <div class="py-[18px]">
    <el-table
      v-loading="loading" :data="tableData" :row-key="config.rowKey"
      :height="495"
      :header-cell-style="{
        height: '45px', background: 'var(--el-border-color)',
      }"
      :tooltip-options="{
        placement: 'top-end',
        popperClass: 'custom-tooltip',
      }"
      show-overflow-tooltip border
      v-bind="config.attrs.table"
      @cell-dblclick="cellDblclick"
    >
      <template #empty>
        <el-empty description="暂无数据" />
      </template>

      <el-table-column
        v-for="key in tableColumns" :key="key"
        :label="definitions[key]?.label" :prop="key" :min-width="110"
        :formatter="formatColumn"
        v-bind="definitions[key]?.tableProps"
      >
        <template #default="scope">
          <component
            :is="definitions[key]?.render?.(scope, { configStores: config, formStores: formStore, tableStores, actionHandler })"
          />
        </template>
      </el-table-column>

      <!-- 自定义插槽列 -->
      <slot name="column" />

      <el-table-column v-if="config.table.menuVisible" label="操作" :width="config.table.menuWidth" :align="config.table.menuAlign">
        <template #default="scope">
          <slot name="top" v-bind="scope" />
          <slot name="menu" v-bind="scope">
            <template v-if="config.table.defButVisible?.(scope.row)">
              <el-link v-if="config.buttonAuth.edit" type="primary" :icon="h('i', { class: 'i-ep:edit' })" @click="actionHandler.Edit(scope.row)">
                编辑
              </el-link>
              <el-link v-if="config.buttonAuth.delete" type="danger" :icon="h('i', { class: 'i-ep:delete' })" @click="actionHandler.Remove(scope.row)">
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
    v-model:current-page="page.currentPage.value"
    v-model:page-size="page.pageSize.value"
    :total="page.total.value"
    :page-sizes="page.pageSizes.value"
    :layout="page.layout.value"
    background
    v-bind="config.attrs.pagination"
    @size-change="sizeChange"
    @current-change="currentChange"
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

/* 在你的样式文件中 */
:deep(.custom-tooltip) {
  max-width: 500px;
}
</style>
