<script setup lang="ts">
import type { CrudEmits, CrudProps, ElFormType } from '@/components/EasyCrud'
import { ActionArea, EditForm, SearchForm, Table, useActionHandler, useConfig, useFormStore, useTableStore } from '@/components/EasyCrud'

import { definitions, fields, type UserInfo } from './crud-default'

const emits = defineEmits<CrudEmits<UserInfo>>()

definePage({
  path: '/example/custom',
  meta: {
    title: 'Crud 自定义',
    order: -1,
  },
})

const aribitaion: CrudProps<UserInfo> = {
  debug: true,
  url: '/user',
  rowKey: 'userId',
  source: { definitions, fields },
}
const config = useConfig(aribitaion)
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

<style scoped lang="scss">

</style>
