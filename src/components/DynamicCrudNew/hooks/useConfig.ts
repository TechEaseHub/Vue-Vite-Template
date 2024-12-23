import type { FormInstance } from 'element-plus'
import type { CrudProps } from '..'
import type { ElDrawerType, ElFormType, ElPaginationType, ElTableType } from '../config'
import type { FieldDefinitions, Source } from '../hooks'

import merge from 'lodash-es/merge'

/** 组件属性 */
export interface Attrs {
  form?: ElFormType
  drawer?: ElDrawerType
  table?: ElTableType
  pagination?: ElPaginationType
}

/** 配置 */
export interface Config {
  /** 表格配置 */
  table: {
    menuVisible?: boolean
    menuAlign?: 'left' | 'center' | 'right'
    menuWidth?: number
    menuTitle?: boolean
  }
  /** 分页配置 */
  pagination: {
    current?: number
    pageSize?: number
    pageSizes?: number[]
    layout?: string
  }
  /** 按钮权限配置 */
  buttonAuth: {
    add?: boolean
    edit?: boolean
    delete?: boolean
  }

  apiEndpoints: {
    query?: string
    add?: string
    edit?: string
    delete?: string
    deleteFlag?: string
  }

}

const defaultValues: Config = {
  table: {
    menuVisible: true,
    menuAlign: 'center',
    menuWidth: 150,
    menuTitle: true,
  },
  pagination: {
    current: 1,
    pageSize: 10,
    pageSizes: [1, 5, 10, 50],
    layout: 'total, ->, sizes, prev, pager, next, jumper',
  },
  buttonAuth: {
    add: true,
    edit: true,
    delete: true,
  },
  apiEndpoints: {
    query: 'query',
    add: 'add',
    edit: 'edit',
    delete: 'delete',
    deleteFlag: 'deleteFlag',
  },
}

export type UseConfigReturnType<T> = ReturnType<typeof useConfig<T>>
export function useConfig<T>(id: string, props?: CrudProps<T>) {
  return defineStore(`${id}__config`, () => {
    const searchFormRef = ref<FormInstance | null>(null)
    const editFormRef = ref<FormInstance | null>(null)

    const debug = computed(() => props?.debug ?? false)
    const isAfterMountQuery = computed(() => props?.isAfterMountQuery ?? false)

    const source = computed<Source<T>>(() => props?.source ?? {
      definitions: {} as FieldDefinitions<T, keyof T>,
      fields: {
        filter: [],
        editor: [],
        expand: [],
        column: [],
      },
    })

    const url = computed(() => props?.url ?? '/not-found')
    const rowKey = computed(() => props?.rowKey)
    const rowKeys = computed(() => props?.rowKeys)

    const attrs = computed<Attrs>(() => ({
      form: { labelWidth: 120, ...props?.attrs?.form },
      drawer: { size: 500, ...props?.attrs?.drawer },
      table: { ...props?.attrs?.table },
      pagination: { ...props?.attrs?.pagination },
    }))

    const table = computed<Config['table']>(() => merge(defaultValues.table, props?.table))
    const pagination = computed<Config['pagination']>(() => merge(defaultValues.pagination, props?.pagination))
    const buttonAuth = computed<Config['buttonAuth']>(() => merge(defaultValues.buttonAuth, props?.buttonAuth))
    const apiEndpoints = computed<Config['apiEndpoints']>(() => merge(defaultValues.apiEndpoints, props?.apiEndpoints))

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
