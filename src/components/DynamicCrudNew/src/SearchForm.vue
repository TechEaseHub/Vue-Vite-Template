<script setup lang="ts" generic="T">
import { ComponentMap } from '../config'
import { useActionHandler, useConfig, useForm } from '../hooks'

const { useId } = defineProps(['useId'])

const configStore = useConfig<T>(useId)
const formStore = useForm<T>(useId)
const actionHandler = useActionHandler<T>(useId)

const { searchFormRef, attrs, source } = storeToRefs(configStore)
const { formVisible, searchForm } = storeToRefs(formStore)
const { Query } = actionHandler

const definitions = computed(() => source.value.definitions)
const filter = computed(() => source.value.fields.filter)

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
          <ElCol v-for="key in filter" :key :span="definitions[key]?.span || 6">
            <ElFormItem :label="definitions[key]?.label" :prop="key" v-bind="formProps(key)">
              <component :is="ComponentMap[definitions[key]?.type]" v-model="searchForm[key]" class="w-full!" v-bind="compProps(key)" />
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
