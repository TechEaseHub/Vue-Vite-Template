import type { ComputedRef } from 'vue'

import type { BaseRow, StringKeyOf } from './base.types'
import type { CrudConfig } from './useConfig.types'
import type { TableStore } from './useTable.types'

export function useTableStore<T extends BaseRow>(config: ComputedRef<CrudConfig<T>>): TableStore<T> {
  const { source: { fields: { column, expand } }, pagination } = config.value

  const loading = ref(false)

  const tableData: Ref<T[]> = ref([])

  const checkColumn = ref([...column]) as Ref<StringKeyOf<T>[]>
  const tableColumns = computed(() => expand.filter(key => checkColumn.value.includes(key)) as StringKeyOf<T>[])

  // 分页属性
  const currentPage = ref(pagination.current ?? 1)
  const pageSize = ref(pagination.pageSize ?? 10)
  const total = ref(0)

  const pageSizes = ref(pagination.pageSizes ?? [10, 20, 30, 40, 50])
  const layout = ref(pagination.layout ?? 'total, ->, sizes, prev, pager, next, jumper')

  return {
    loading,
    tableData,
    checkColumn,
    tableColumns,
    page: {
      currentPage,
      pageSize,
      total,
      pageSizes,
      layout,
    },
  }
}
