import type { BaseRow } from '../index'
import { useConfig } from '../index'

export type UseTableReturnType<T extends BaseRow> = ReturnType<typeof useTable<T>>

export function useTable<T extends BaseRow>(id: string) {
  const { source: { fields }, pagination } = useConfig<T>(id)

  return defineStore(`${id}__table`, () => {
    const loading = ref(false)
    const tableData = ref<T[]>([])
    const checkColumn = ref<string[]>([...fields.column] as string[])
    const tableColumns = computed(() => fields.expand.filter(key =>
      checkColumn.value.includes(key as string),
    ))

    // 分页属性
    const { current, pageSize, pageSizes, layout } = pagination
    const total = ref(0)

    return {
      loading,
      tableData,
      checkColumn,
      tableColumns,
      currentPage: ref(current),
      pageSize: ref(pageSize),
      total,
      pageSizes: ref(pageSizes),
      layout: ref(layout),
    }
  })()
}
