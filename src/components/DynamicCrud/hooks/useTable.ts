import type { BaseRow } from '../index'
import { useConfig } from '../index'

export type UseTableReturnType<T extends BaseRow> = ReturnType<typeof useTable<T>>
export function useTable<T extends BaseRow>(id: string) {
  const configStore = useConfig<T>(id)
  const fields = configStore.source.fields
  const pagination = configStore.pagination

  return defineStore(`${id}__table`, () => {
    const loading = ref(false)

    const tableData = ref<any[]>([
      { index: 1 },
      { index: 2 },
      { index: 3 },
      { index: 4 },
      { index: 5 },
      { index: 6 },
      { index: 7 },
      { index: 8 },
      { index: 9 },
      { index: 10 },
    ])

    const checkColumn = ref<(keyof T)[]>([...fields.column])
    const tableColumns = computed(() => fields.expand.filter(key => (checkColumn.value as (keyof T)[]).includes(key)))

    // 分页属性
    const currentPage = ref(pagination.current)
    const pageSize = ref(pagination.pageSize)
    const total = ref(0)
    const pageSizes = ref(pagination.pageSizes)
    const layout = ref(pagination.layout)

    return {
      loading,

      tableData,
      checkColumn,
      tableColumns,

      currentPage,
      pageSize,
      total,
      pageSizes,
      layout,
    }
  })()
}
