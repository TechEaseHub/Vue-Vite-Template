import type { BaseRow, CrudContext, TableStore } from './index.types'

export function useTableStore<T extends BaseRow>(context: CrudContext<T>): TableStore<T> {
    const { source: { fields: { column, expand } }, pagination } = context.config

    const loading = ref(false)

    const tableData: Ref<T[]> = ref([])

    const checkColumn = ref([...column]) as Ref<(keyof T)[]>
    const tableColumns = computed(() => expand.filter(key => checkColumn.value.includes(key)) as (keyof T)[])

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
