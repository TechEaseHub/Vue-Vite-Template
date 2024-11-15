<script setup lang="ts" generic="T extends BaseRow">
import type { BaseRow, ElFormType } from '../hooks/base.types'
import type { ActionHandler } from '../hooks/useActions.types'
import type { CrudConfig } from '../hooks/useConfig.types'
import type { FormStore } from '../hooks/useForm.types'
import type { TableStore } from '../hooks/useTable.types'

import { h } from 'vue'

const props = defineProps<{ config: CrudConfig<T>, actionHandler: ActionHandler<T> }>()

const searchFormRef = defineModel<ElFormType | undefined>('searchFormRef', { required: true })
const formStore = defineModel<FormStore<T>>('formStore', { required: true })
const tableStores = defineModel<TableStore<T>>('tableStores', { required: true })

const config = computed(() => props.config)
const actionHandler = computed(() => props.actionHandler)

const definitions = computed(() => config.value.source.definitions)
const fields = computed(() => config.value.source.fields)
const { formVisible, reset } = formStore.value
const { checkColumn } = tableStores.value

// 表格列的显示控制
const checkAll = ref(false)
const isIndeterminate = ref(true)
function handleCheckAllChange(val: string | number | boolean) {
  const expand = fields.value.expand
  const column = fields.value.column
  checkColumn.value = val ? expand : column
  isIndeterminate.value = false
}
// 表格列的显示控制按钮
const settingRef = ref()
const popoverRef = ref()
</script>

<template>
  <div class="ml-[-12px] flex justify-between">
    <div flex="~ 1 justify-between">
      <div class="action left" flex="~ gap-[10px_0px] wrap">
        <el-button v-if="config.buttonAuth.add" type="primary" :icon="h('i', { class: 'i-ep:plus' })" @click="actionHandler.Add">
          新增
        </el-button>
        <slot name="left" />
      </div>
      <div class="action right" flex="~ gap-[10px_0px] wrap row-reverse">
        <slot name="right" />
      </div>
    </div>
    <div class="ml-[12px] shrink-0">
      <el-button-group>
        <el-button type="success" :icon="h('i', { class: 'i-ep:search' })" @click="actionHandler.Query()" />
        <el-button type="warning" :icon="h('i', { class: 'i-ep:refresh-left' })" @click="reset(searchFormRef, '搜索')" />
        <el-button type="primary" :icon="h('i', { class: 'i-ep:sort' })" @click="formVisible = !formVisible" />
        <el-button ref="settingRef" type="info" :icon="h('i', { class: 'i-ep:operation' })" />
      </el-button-group>
    </div>
  </div>

  <el-popover ref="popoverRef" :virtual-ref="settingRef" trigger="click" virtual-triggering :width="182" placement="bottom-end">
    <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">
      全选
    </el-checkbox>
    <div class="w-full border-b" />
    <el-scrollbar height="400px">
      <el-checkbox-group v-model="checkColumn">
        <el-checkbox v-for="key in fields.expand" :key :label="definitions[key]?.label" :value="key" />
      </el-checkbox-group>
    </el-scrollbar>
  </el-popover>
</template>

<style scoped lang="scss">
.action > .el-button:first-child {
  margin-left: 12px;
}
</style>
