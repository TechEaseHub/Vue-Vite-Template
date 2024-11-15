import type { Ref, ToRefs } from 'vue'
import type { StringKeyOf } from './base.types'

export interface TableStore<T> {
  /** 表格加载状态 */
  loading: Ref<boolean>
  /** 表格数据 */
  tableData: Ref<T[]>

  /** 选中的表格列 */
  checkColumn: Ref<StringKeyOf<T>[]>
  /** 表格列（根据配置的顺序） */
  tableColumns: Ref<StringKeyOf<T>[]>

  /** 分页属性 */
  page: ToRefs<Pagination>
}

interface Pagination {
  /* 每页条数选项 */
  pageSizes: number[]
  /* 布局 */
  layout: string
  /* 当前页 */
  currentPage: number
  /* 每页条数 */
  pageSize: number
  /* 总条数 */
  total: number
}
