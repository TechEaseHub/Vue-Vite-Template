<script setup lang="ts" generic="T extends BaseRow">
import type { BaseRow, DynamicStoreReturnType } from '..'

import { h } from 'vue'

defineOptions({ name: 'ActionButtons' })

const { configStore, formStore, tableStore, actionHandler } = inject<DynamicStoreReturnType<BaseRow>>('DynamicStore')!

const { searchFormRef, buttonAuth, source } = storeToRefs(configStore)
const { checkColumn } = storeToRefs(tableStore)
const { Query, Add } = actionHandler

// 表格列的显示控制按钮
const settingRef = ref()
const popoverRef = ref()
// 表格列的显示控制
const checkAll = ref(false)
const isIndeterminate = ref(true)
// 改变表格列的显示控制
function handleCheckAllChange(val: string | number | boolean) {
  const expand = source.value?.fields.expand
  const column = source.value?.fields.column
  checkColumn.value = val ? expand : column
  isIndeterminate.value = false
}
</script>

<template>
  <slot name="button">
    <div class="flex items-center justify-between">
      <div class="flex flex-1 justify-between">
        <div class="flex flex-wrap gap-[12px] first:ml-0">
          <el-button v-if="buttonAuth.add" type="primary" :icon="h('i', { class: 'i-ep:plus' })" @click="Add">
            新增
          </el-button>
          <slot name="button-left" />
        </div>

        <div class="flex flex-row-reverse flex-wrap flex-wrap gap-[12px]">
          <slot name="button-right" />
        </div>
      </div>
      <div class="ml-[12px] shrink-0">
        <el-button-group>
          <el-button type="success" :icon="h('i', { class: 'i-ep:search' })" @click="Query()" />
          <el-button type="warning" :icon="h('i', { class: 'i-ep:refresh-left' })" @click="formStore.reset(searchFormRef, 'Search')" />
          <el-button type="primary" :icon="h('i', { class: 'i-ep:sort' })" @click="formStore.formVisible = !formStore.formVisible" />
          <el-button ref="settingRef" type="info" :icon="h('i', { class: 'i-ep:operation' })" />
        </el-button-group>
      </div>
    </div>
  </slot>

  <el-popover ref="popoverRef" :virtual-ref="settingRef" trigger="click" virtual-triggering :width="182" placement="bottom-end">
    <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">
      全选
    </el-checkbox>
    <div class="w-full border-b" />
    <el-scrollbar max-height="400px">
      <el-checkbox-group v-model="checkColumn">
        <el-checkbox v-for="key in source.fields.expand" :key :label="source.definitions[key]?.label || key" :value="key" />
      </el-checkbox-group>
    </el-scrollbar>
  </el-popover>
</template>
