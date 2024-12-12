import type { BaseRow, DefineForm, ElDrawerType, ElFormType, ElPaginationType, ElTableType, HooksConfig, Source, StringKeyOf } from '../index'
import { merge } from 'lodash-es'

export interface CrudProps<T extends BaseRow> {
  debug?: boolean
  isAfterMountQuery?: boolean
  url: string
  source: Source<T>
  rowKey?: StringKeyOf<T>
  rowKeys?: StringKeyOf<T>[]
  attrs?: Attrs
  table?: TableConfig
  pagination?: PaginationConfig
  apiEndpoints?: ApiEndpoints
  buttonAuth?: ButtonAuth
  hooks?: HooksConfig<T>
}

export interface CrudEmits<T> {
  (event: 'change:searchForm', form: DefineForm<T>, key: keyof T): void
  (event: 'change:editForm', form: DefineForm<T>, key: keyof T): void
}

export interface Attrs {
  form?: Partial<ElFormType['$props']> & Partial<ElFormType['$emit']>
  drawer?: Partial<ElDrawerType['$props']> & Partial<ElDrawerType['$emit']>
  table?: Partial<ElTableType['$props']> & Partial<ElTableType['$emit']>
  pagination?: Partial<ElPaginationType['$props']> & Partial<ElPaginationType['$emit']>
}

export interface TableConfig {
  menuVisible?: boolean
  menuAlign?: 'left' | 'center' | 'right'
  menuWidth?: number
  menuTitle?: boolean
}

export interface PaginationConfig {
  current?: number
  pageSize?: number
  pageSizes?: number[]
  layout?: string
}

export interface ButtonAuth {
  add?: boolean
  edit?: boolean
  delete?: boolean
}

export interface ApiEndpoints {
  query?: string
  add?: string
  edit?: string
  delete?: string
  deleteFlag?: string
}

const defaultTable: TableConfig = {
  menuVisible: true,
  menuAlign: 'center',
  menuWidth: 150,
  menuTitle: true,
}

const defaultPagination: PaginationConfig = {
  current: 1,
  pageSize: 10,
  pageSizes: [1, 5, 10, 50],
  layout: 'total, ->, sizes, prev, pager, next, jumper',
}

const defaultButtonAuth: ButtonAuth = {
  add: true,
  edit: true,
  delete: true,
}

const defaultApiEndpoints: ApiEndpoints = {
  query: 'query',
  add: 'add',
  edit: 'edit',
  delete: 'delete',
  deleteFlag: 'deleteFlag',
}

export type UseConfigReturnType<T extends BaseRow> = ReturnType<typeof useConfig<T>>
export function useConfig<T extends BaseRow>(id: string, props?: CrudProps<T>) {
  return defineStore(`${id}__config`, () => {
    const searchFormRef = ref<ElFormType>()
    const editFormRef = ref<ElFormType>()

    const debug = computed(() => props?.debug ?? false)
    const isAfterMountQuery = computed(() => props?.isAfterMountQuery ?? false)

    const source = computed(() => props?.source ?? {
      definitions: {} as Source<T>['definitions'],
      fields: {
        filter: [],
        editor: [],
        expand: [],
        column: [],
      },
    })

    const url = computed(() => props?.url)
    const rowKey = computed(() => props?.rowKey)
    const rowKeys = computed(() => props?.rowKeys)

    const attrs = computed<Attrs>(() => ({
      form: { labelWidth: 120, ...props?.attrs?.form },
      drawer: { size: 500, ...props?.attrs?.drawer },
      table: { ...props?.attrs?.table },
      pagination: { ...props?.attrs?.pagination },
    }))

    const table = computed<TableConfig>(() => merge(defaultTable, props?.table))
    const pagination = computed<PaginationConfig>(() => merge(defaultPagination, props?.pagination))
    const buttonAuth = computed<ButtonAuth>(() => merge(defaultButtonAuth, props?.buttonAuth))
    const apiEndpoints = computed<ApiEndpoints>(() => merge(defaultApiEndpoints, props?.apiEndpoints))

    const hooks = computed(() => props?.hooks || {})

    return {
      searchFormRef,
      editFormRef,
      debug,
      isAfterMountQuery,
      url,
      source,
      rowKey,
      rowKeys,
      attrs,
      table,
      pagination,
      buttonAuth,
      apiEndpoints,
      hooks,
    }
  })()
}
