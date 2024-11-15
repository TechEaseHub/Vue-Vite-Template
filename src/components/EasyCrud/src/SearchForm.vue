<script setup lang="ts" generic="T extends BaseRow">
import type { BaseRow, ElFormType } from '../hooks/base.types'
import type { ActionHandler } from '../hooks/useActions.types'
import type { CrudConfig } from '../hooks/useConfig.types'
import type { FormStore } from '../hooks/useForm.types'

const props = defineProps<{ config: CrudConfig<T>, actionHandler: ActionHandler<T> }>()
const searchFormRef = defineModel<ElFormType | undefined>('searchFormRef', { required: true })
const formStore = defineModel<FormStore<T>>('formStore', { required: true })

const config = computed(() => props.config)
const actionHandler = computed(() => props.actionHandler)
</script>

<template>
  <ElCollapseTransition v-show="formStore.formVisible.value">
    <ElForm ref="searchFormRef" :model="formStore.searchForm" :label-width="config.attrs.form?.labelWidth" @submit.prevent="actionHandler.Query()">
      <ElRow>
        <slot name="top" />
        <ElCol v-for="key in config.source.fields.filter" :key="key" :span="config.source.definitions[key]?.span || 6">
          <ElFormItem :label="config.source.definitions[key]?.label" :prop="key" v-bind="{ ...config.source.definitions[key]?.formProps, ...config.source.definitions[key]?.formProps?.search }">
            <component
              :is="config.source.definitions[key]?.type" v-model="formStore.searchForm[key]"
              class="w-full!" clearable
              v-bind="{ ...config.source.definitions[key]?.componentProps, ...config.source.definitions[key]?.componentProps?.search }"
            />
          </ElFormItem>
        </ElCol>
      </ElRow>
      <button type="submit" style="display: none;" />
    </ElForm>
  </ElCollapseTransition>
</template>

<style scoped lang="scss">

</style>
