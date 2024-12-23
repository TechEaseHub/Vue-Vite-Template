<script setup lang="ts">
import type { CrudProps, StringKeyOf } from '@/components/DynamicCrudNew'
import type { Example } from './default'
import { useActionHandler, useConfig, useForm, useTable } from '@/components/DynamicCrudNew/hooks'
import { ActionButtons, DataTable, EditForm, SearchForm } from '@/components/DynamicCrudNew/src'
import { debounce } from 'lodash-es'
import { source } from './default'

definePage({
  meta: {
    title: 'custom',
    order: 1,
  },
})

const aribitaion: CrudProps<Example> = {
  debug: true,
  url: '/appInfo',
  rowKey: 'id',
  source,
}

// 创建动态 store
const useId = aribitaion.url
const configStore = useConfig<Example>(useId, aribitaion)
const formStore = useForm<Example>(useId)
const tableStore = useTable<Example>(useId)
useActionHandler<Example>(useId)

const debug = computed(() => configStore.debug)
const definitions = computed(() => configStore.source.definitions)
const filter = computed(() => configStore.source.fields.filter)
const editor = computed(() => configStore.source.fields.editor)
const searchForm = formStore.searchForm
const editForm = formStore.editForm

// 对表单参数进行初始化赋值，并添加改变监听事件
for (const key in definitions.value) {
  const k = key as StringKeyOf<Example>
  if (debug.value && filter.value.includes(k)) {
    watch(
      () => searchForm[k],
      debounce((newVal, oldVal) => {
        console.log(`searchForm: \`${k}\` changed \n from: ${oldVal} \n to: ${newVal}`)
      }, 500),
    )
  }

  if (debug.value && editor.value.includes(k)) {
    watch(
      () => editForm[k],
      debounce((newVal, oldVal) => {
        console.log(`editForm: \`${k}\` changed \n from: ${oldVal} \n to: ${newVal}`)
      }, 500),
    )
  }
}

onUnmounted(() => {
  // 销毁 动态 store
  configStore.$dispose()
  formStore.$dispose()
  tableStore.$dispose()
})
</script>

<template>
  <div class="border rounded-[20px] bg-[var(--el-bg-color)] p-[20px]">
    <SearchForm :use-id />
    <ActionButtons :use-id />
    <DataTable :use-id />
    <EditForm :use-id />
  </div>
</template>

<style lang="scss" scoped></style>
