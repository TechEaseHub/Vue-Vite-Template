<script setup lang="ts" generic="T">
import { h } from 'vue'
import type { CrudOptions } from '..'

const { crudOptions } = defineProps<{ crudOptions: CrudOptions<T> }>()

const {
    source: { fields: { expand }, columns },
    FormStore: { FormSearchRef, formVisible, reset },
    TableStore: { checkColumn },
    ActionHandler: { Query, Add },
} = crudOptions as CrudOptions<any>

const settingRef = ref()
const popoverRef = ref()
</script>

<template>
    <div class="ml--12 flex justify-between">
        <div flex="~ 1 justify-between">
            <div class="action left" flex="~ gap-[10px_0px] wrap">
                <el-button type="primary" :icon="h('i', { class: 'i-ep:plus' })" @click="Add()">
                    新增
                </el-button>
                <slot name="left" />
            </div>
            <div class="action right" flex="~ gap-[10px_0px] wrap row-reverse">
                <slot name="right">
                    <el-button type="info" :icon="h('i', { class: 'i-ep:download' })">
                        导出
                    </el-button>
                </slot>
            </div>
        </div>
        <div class="ml-12 shrink-0">
            <el-button-group>
                <el-button type="success" :icon="h('i', { class: 'i-ep:search' })" @click="Query()" />
                <el-button type="warning" :icon="h('i', { class: 'i-ep:refresh-left' })" @click="reset(FormSearchRef, 'search')" />
                <el-button type="primary" :icon="h('i', { class: 'i-ep:sort' })" @click="formVisible = !formVisible" />
                <el-button ref="settingRef" type="info" :icon="h('i', { class: 'i-ep:operation' })" />
            </el-button-group>
        </div>
    </div>

    <el-popover ref="popoverRef" :virtual-ref="settingRef" trigger="click" virtual-triggering :width="182" placement="bottom-end">
        <el-scrollbar height="400px">
            <el-checkbox-group v-model="checkColumn">
                <el-checkbox v-for="key in new Set(expand)" :key :label="columns[key].label" :value="key" />
            </el-checkbox-group>
        </el-scrollbar>
    </el-popover>
</template>

<style scoped lang="scss">
.action > .el-button:first-child {
    margin-left: 12px;
}
</style>
