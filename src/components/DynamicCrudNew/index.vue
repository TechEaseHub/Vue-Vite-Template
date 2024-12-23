<script setup lang="ts" generic="T">
import type { CrudEmits, CrudProps, StringKeyOf } from './index'
import { debounce } from 'lodash-es'
import { useActionHandler, useConfig, useForm, useTable } from './hooks'
import { ActionButtons, DataTable, EditForm, SearchForm } from './src'

const props = defineProps<CrudProps<T>>()
const emits = defineEmits<CrudEmits<T>>()

// 创建动态 store
const useId = props.url
const configStore = useConfig<T>(useId, props)
const formStore = useForm<T>(useId)
const tableStore = useTable<T>(useId)
useActionHandler<T>(useId)

const debug = computed(() => configStore.debug)
const definitions = computed(() => configStore.source.definitions)
const filter = computed(() => configStore.source.fields.filter)
const editor = computed(() => configStore.source.fields.editor)
const searchForm = formStore.searchForm
const editForm = formStore.editForm

// 对表单参数进行初始化赋值，并添加改变监听事件
for (const key in definitions.value) {
  const k = key as StringKeyOf<T>
  if (debug.value && emits && filter.value.includes(k)) {
    watch(
      () => searchForm[k],
      debounce((newVal, oldVal) => {
        console.log(`searchForm: \`${k}\` changed \n from: ${oldVal} \n to: ${newVal}`)
        emits('change', 'searchForm', searchForm, k)
      }, 500),
    )
  }

  if (debug.value && emits && editor.value.includes(k)) {
    watch(
      () => editForm[k],
      debounce((newVal, oldVal) => {
        console.log(`editForm: \`${k}\` changed \n from: ${oldVal} \n to: ${newVal}`)
        emits('change', 'editForm', editForm, k)
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
