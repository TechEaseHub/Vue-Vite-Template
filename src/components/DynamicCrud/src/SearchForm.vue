<script setup lang="ts" generic="T extends BaseRow">
import type { BaseRow, DynamicStoreReturnType } from '..'

const { configStore, formStore, actionHandler } = inject<DynamicStoreReturnType<BaseRow>>('DynamicStore')!
const { searchFormRef, attrs, source } = storeToRefs(configStore)
const { formVisible, searchForm } = storeToRefs(formStore)
const { Query } = actionHandler

const formProps = computed(() => {
  return (key: keyof T) => {
    const props = source.value.definitions[key]?.formProps || {}
    const searchProps = source.value.definitions[key]?.formProps?.search || {}
    return { ...props, ...searchProps }
  }
})

const compProps = computed(() => {
  return (key: keyof T) => {
    const props = source.value.definitions[key]?.componentProps || {}
    const searchProps = source.value.definitions[key]?.componentProps?.search || {}
    return { clearable: true, ...props, ...searchProps }
  }
})
</script>

<template>
  <ElCollapseTransition v-show="formVisible">
    <slot name="search-form">
      <ElForm ref="searchFormRef" :model="searchForm" :label-width="attrs.form?.labelWidth" v-bind="attrs.form " @submit.prevent="Query()">
        <ElRow>
          <slot name="search-form-top" />
          <ElCol v-for="key in source.fields.filter" :key :span="source.definitions[key]?.span || 6">
            <ElFormItem :label="source.definitions[key]?.label" :prop="key" v-bind="formProps(key)">
              <component :is="source.definitions[key]?.type" v-model="searchForm[key]" class="w-full!" v-bind="compProps(key)" />
            </ElFormItem>
          </ElCol>
          <slot name="search-form-bottom" />
        </ElRow>
        <!-- 为了可以实现 @submit -->
        <button type="submit" style="display: none;" />
      </ElForm>
    </slot>
  </ElCollapseTransition>
</template>
