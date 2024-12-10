<script setup lang="ts" generic="T extends BaseRow">
import type { BaseRow, CrudEmits, CrudProps, DynamicStoreReturnType } from './index'
import { ActionButtons, DataTable, EditForm, InitDynamicStore, SearchForm } from './index'

defineOptions({ name: 'DynamicCrud' })

const props = defineProps<CrudProps<T>>()
const emits = defineEmits<CrudEmits<T>>()

// 初始化 动态 store
const DynamicStore: DynamicStoreReturnType<T> = InitDynamicStore<T>(props, emits)
provide('DynamicStore', DynamicStore)

onUnmounted(() => {
  // 销毁 动态 store
  DynamicStore.dispose()
})
</script>

<template>
  <div class="border rounded-[20px] bg-[var(--el-bg-color)] p-[20px]">
    <SearchForm>
      <template #search-form>
        <slot name="search-form" v-bind="DynamicStore" />
      </template>
      <template #search-form-top>
        <slot name="search-form-top" v-bind="DynamicStore" />
      </template>
      <template #search-form-bottom>
        <slot name="search-form-bottom" v-bind="DynamicStore" />
      </template>
    </SearchForm>

    <ActionButtons>
      <template #button>
        <slot name="button" v-bind="DynamicStore" />
      </template>
      <template #button-left>
        <slot name="button-left" v-bind="DynamicStore" />
      </template>
      <template #button-right>
        <slot name="button-right" v-bind="DynamicStore" />
      </template>
    </ActionButtons>

    <DataTable>
      <template #table-column>
        <slot name="table-column" v-bind="DynamicStore" />
      </template>
      <template #menu-top>
        <slot name="menu-top" v-bind="DynamicStore" />
      </template>
      <template #menu>
        <slot name="menu" v-bind="DynamicStore" />
      </template>
      <template #menu-bottom>
        <slot name="menu-bottom" v-bind="DynamicStore" />
      </template>
    </DataTable>

    <EditForm>
      <template #edit-form>
        <slot name="edit-form" v-bind="DynamicStore" />
      </template>
      <template #edit-form-top>
        <slot name="edit-form-top" v-bind="DynamicStore" />
      </template>
      <template #edit-form-bottom>
        <slot name="edit-form-bottom" v-bind="DynamicStore" />
      </template>
    </EditForm>
  </div>
</template>

<style scoped lang="scss">

</style>
