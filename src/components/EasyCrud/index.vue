<script setup lang="ts" generic="T extends BaseRow">
import type { BaseRow, CrudEmits, CrudSlots, ElFormType } from './hooks/index.types'
import type { CrudProps } from './hooks/useConfig.types'

import { ActionArea, EditForm, SearchForm, Table } from './hooks/index'
import { useActionHandler } from './hooks/useActions'
import { useConfig } from './hooks/useConfig'
import { useFormStore } from './hooks/useForm'
import { useTableStore } from './hooks/useTable'

const props = defineProps<CrudProps<T>>()
const emits = defineEmits<CrudEmits<T>>()
defineSlots<CrudSlots<T>>()

const config = useConfig(props)
const formStore = useFormStore(config, emits)
const tableStores = useTableStore(config)
const actionHandler = useActionHandler(config, formStore, tableStores)

const searchFormRef = ref<ElFormType>()
const editFormRef = ref<ElFormType>()
</script>

<template>
  <div class="border rounded-[20px] bg-[var(--el-bg-color)] p-[20px]">
    <SearchForm
      v-model:search-form-ref="searchFormRef"
      v-model:form-store="formStore"
      :config :action-handler
    />
    <ActionArea
      v-model:search-form-ref="searchFormRef"
      v-model:form-store="formStore"
      v-model:table-stores="tableStores"
      :config :action-handler
    />
    <Table
      v-model:form-store="formStore"
      v-model:table-stores="tableStores"
      :config :action-handler
    />
    <EditForm
      v-model:edit-form-ref="editFormRef"
      v-model:form-store="formStore"
      :config :action-handler
    />
  </div>
</template>

<style scoped lang="scss"></style>
