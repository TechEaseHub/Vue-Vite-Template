import type { TableColumnCtx } from 'element-plus'

import type { ActionHandler } from './useActions.types'
import type { CrudConfig, CrudProps } from './useConfig.types'
import type { FormStore } from './useForm.types'
import type { TableStore } from './useTable.types'

export * from './base.types'
export * from './useActions.types'
export * from './useConfig.types'
export * from './useForm.types'
export * from './useHooks.types'
export * from './useTable.types'

export interface CrudEmits<T> {
  (event: 'change:searchForm', form: Partial<T>, key: keyof T): void
  (event: 'change:editForm', form: Partial<T>, key: keyof T): void
}

export interface CrudSlots<T> {
  'default': () => any
  'search-form': (scope: CrudOptions<T>) => any
  'search-form-top': (scope: CrudOptions<T>) => any
  'search-form-bottom': (scope: CrudOptions<T>) => any
  'button-left': (scope: CrudOptions<T>) => any
  'button-right': (scope: CrudOptions<T>) => any
  'table-column': () => any
  'table-menu': (scope: { row: T, column: TableColumnCtx<T>, $index: number } & CrudOptions<T>) => any
  'table-menu-top': (scope: { row: T, column: TableColumnCtx<T>, $index: number } & CrudOptions<T>) => any
  'table-menu-bottom': (scope: { row: T, column: TableColumnCtx<T>, $index: number } & CrudOptions<T>) => any
  'edit-form': (scope: CrudOptions<T>) => any
  'edit-form-top': (scope: CrudOptions<T>) => any
  'edit-form-bottom': (scope: CrudOptions<T>) => any
}

export interface CrudContext<T> {
  props: CrudProps<T>
  emits: CrudEmits<T>
  slots: CrudSlots<T>
}

export interface CrudOptions<T> {
  configStores: CrudConfig<T>

  formStores: FormStore<T>
  tableStores: TableStore<T>
  actionHandler: ActionHandler<T>
}

/** 查询响应 */
export interface RequestResult<T> {
  /** 后端返回的状态码 */
  code: number
  /** 处理消息 */
  message: string
  /** 数据 */
  data: T[]
  /** 分页 */
  page: {
    /** 当前页 */
    pageNum: number
    /** 分页大小 */
    pageSize: number
    /** 总页数 */
    pages: number
    /** 总条数 */
    total: number
  } | null
}
