<script setup lang="ts">
import type { CrudProps, DynamicStoreReturnType } from '@/components/DynamicCrud'
import type { Example } from './default'

import { ActionButtons, DataTable, EditForm, InitDynamicStore, SearchForm } from '@/components/DynamicCrud'
import { definitions, fields } from './default'

definePage({
  meta: {
    title: 'custom',
    order: 2,
  },
})

const aribitaion: CrudProps<Example> = {
  debug: true,
  url: '/appInfo',
  rowKey: 'id',
  source: { definitions, fields },
}

// 初始化 动态 store
const DynamicStore: DynamicStoreReturnType<Example> = InitDynamicStore(aribitaion)
provide('DynamicStore', DynamicStore)

onUnmounted(() => {
  // 销毁 动态 store
  DynamicStore.dispose()
})
</script>

<template>
  <div class="div-c">
    Custom
  </div>

  <div class="border rounded-[20px] bg-[var(--el-bg-color)] p-[20px]">
    <SearchForm />

    <ActionButtons />

    <DataTable />

    <EditForm />
  </div>
</template>

<style scoped lang="scss">

</style>
