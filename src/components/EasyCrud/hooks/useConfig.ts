import type { ComputedRef } from 'vue'

import type { CrudConfig, CrudProps } from './useConfig.types'

export function useConfig<T>(props: CrudProps<T>): ComputedRef<CrudConfig<T>> {
  return computed<CrudConfig<T>>(() => {
    return {
      attrs: {
        form: {
          labelWidth: 120,
          ...props.attrs?.form,
        },
        drawer: {
          size: 500,
          ...props.attrs?.drawer,
        },
        table: {
          ...props.attrs?.table,
        },
        pagination: {
          ...props.attrs?.pagination,
        },
      },
      hooks: { ...props.hooks },
      table: {
        menuVisible: true,
        menuAlign: 'center',
        menuWidth: 150,
        menuTitle: true,
        defButVisible: (row: any) => row.deleteFlag === 0,
        ...props.table,
      },
      pagination: {
        current: 1,
        pageSize: 10,
        pageSizes: [10, 20, 50, 100],
        layout: 'total, ->, sizes, prev, pager, next, jumper',
        ...props.pagination,
      },
      buttonAuth: {
        add: true,
        edit: true,
        delete: true,
        ...props.buttonAuth,
      },
      apiEndpoints: {
        query: 'query',
        add: 'add',
        edit: 'edit',
        delete: 'delete',
        deleteFlag: 'deleteFlag',
        ...props.apiEndpoints,
      },
      debug: props.debug ?? false,
      isAfterMountQuery: props.isAfterMountQuery ?? false,

      url: props.url!,
      rowKey: props.rowKey,
      rowKeys: props.rowKeys,
      source: props.source!,
    }
  })
}
