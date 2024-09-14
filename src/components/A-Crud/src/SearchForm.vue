<script setup lang="ts" generic="T extends BaseRow">
import type { BaseRow, CrudOptions } from '../hooks/index.types'

const crudOptions = inject('crudOptions') as CrudOptions<BaseRow>

const searchForm = defineModel<T>('modelValue', { required: true })

const {
    Ref: { SearchFormRef },
    config: { source: { fields: { filter }, definitions }, attrs },
    formStores: { formVisible },
    actionHandler: { Query },
} = crudOptions
</script>

<template>
    <ElCollapseTransition v-show="formVisible">
        <slot name="form" />

        <ElForm ref="SearchFormRef" :model="searchForm" @submit.prevent="Query()" v-bind="attrs.form">
            <ElRow>
                <slot name="top" />
                <ElCol v-for="key in filter" :key="key" :span="definitions[key]?.span || 6">
                    <ElFormItem :label="definitions[key]?.label" :prop="key" v-bind="{ ...definitions[key]?.formProps, ...definitions[key]?.formProps?.search }">
                        <component
                            :is="definitions[key]?.type" v-model="searchForm[key]"
                            class="w-full!" clearable
                            v-bind="{ ...definitions[key]?.componentProps, ...definitions[key]?.componentProps?.search }"
                        />
                    </ElFormItem>
                </ElCol>
                <slot name="bottom" />
            </ElRow>
            <button type="submit" style="display: none;" />
        </ElForm>
    </ElCollapseTransition>
</template>

<style scoped lang="scss">

</style>
