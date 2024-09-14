<script setup lang="ts" generic="T extends BaseRow">
import { h } from 'vue'

import type { BaseRow, CrudOptions } from '../hooks/index.types'

const crudOptions = inject('crudOptions') as CrudOptions<BaseRow>

const {
    Ref: { SearchFormRef },
    config: { source: { fields: { expand, column }, definitions }, buttonAuth },
    formStores: { formVisible, reset },
    tableStores: { checkColumn },
    actionHandler: { Query, Add },
} = crudOptions

// 表格列的显示控制
const checkAll = ref(false)
const isIndeterminate = ref(true)
function handleCheckAllChange(val: string | number | boolean) {
    checkColumn.value = val ? expand : column
    isIndeterminate.value = false
}

// 表格列的显示控制按钮
const settingRef = ref()
const popoverRef = ref()
</script>

<template>
    <div class="ml--12 flex justify-between">
        <div flex="~ 1 justify-between">
            <div class="action left" flex="~ gap-[10px_0px] wrap">
                <el-button v-if="buttonAuth.add" type="primary" :icon="h('i', { class: 'i-ep:plus' })" @click="Add()">
                    新增
                </el-button>
                <slot name="left" />
            </div>
            <div class="action right" flex="~ gap-[10px_0px] wrap row-reverse">
                <slot name="right" />
            </div>
        </div>
        <div class="ml-12 shrink-0">
            <el-button-group>
                <el-button type="success" :icon="h('i', { class: 'i-ep:search' })" @click="Query()" />
                <el-button type="warning" :icon="h('i', { class: 'i-ep:refresh-left' })" @click="reset(SearchFormRef, '搜索')" />
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
                <el-checkbox v-for="key in expand" :key :label="definitions[key]?.label" :value="key" />
            </el-checkbox-group>
        </el-scrollbar>
    </el-popover>
</template>

<style scoped lang="scss">
.action > .el-button:first-child {
    margin-left: 12px;
}
</style>
