<script setup lang="ts" generic="T">
import type { FormInstance } from 'element-plus'
import type { Attrs, CrudOptions } from '..'

const { crudOptions } = defineProps<{ crudOptions: CrudOptions<T>, attrs?: Attrs }>()

const searchForm = defineModel<Record<string, any>>({ required: true })
const {
    source: { fields: { filter }, columns },
    FormStore: { FormSearchRef, formVisible },
} = crudOptions as CrudOptions<any>
</script>

<template>
    <ElCollapseTransition v-show="formVisible">
        <ElForm :ref="el => { FormSearchRef = el as FormInstance }" :model="searchForm" label-width="120px" v-bind="attrs?.form">
            <ElRow>
                <ElCol v-for="key in new Set(filter)" :key="key" :span="columns[key].span || 6">
                    <ElFormItem :label="columns[key].label" :prop="key" v-bind="{ ...columns[key]?.formProps, ...columns[key]?.formProps?.search }">
                        <component
                            :is="columns[key].type" v-model="searchForm[key]"
                            class="w-full!" clearable
                            v-bind="{ ...columns[key]?.componentProps, ...columns[key]?.componentProps?.search }"
                        >
                            <!-- TODO：动态插槽 -->
                            <!-- <template v-for="(_, slotName) in solts" :key="slotName" #[slotName]="soltData">
                                <slot :name="slotName" v-bind="soltData" />
                            </template> -->
                            <!-- <template #prefix>
                                <el-icon class="el-input__icon">
                                    <i class="i-ep:close" />
                                </el-icon>
                            </template> -->
                        </component>
                    </ElFormItem>
                </ElCol>
            </ElRow>
        </ElForm>
    </ElCollapseTransition>
</template>

<style scoped lang="scss">

</style>
