import { isArray, mergeWith } from 'lodash-es'

import type { ApiEndpoints, Attrs, ButtonAuth, CrudConfig, PaginationConfig, TableConfig } from './useConfig.types'

export function useConfig<T>(props: Partial<CrudConfig<T>>): CrudConfig<T> {
    const attrs: Attrs = {
        form: {
            labelWidth: 120,
        },
        drawer: {
            size: 500,
        },
        table: {},
        pagination: {},
    }

    const table: TableConfig = {
        menuVisible: true,
        menuAlign: 'center',
        menuWidth: 150,
    }

    const pagination: PaginationConfig = {
        current: 1,
        pageSize: 10,
        pageSizes: [10, 20, 50, 100],
        layout: 'total, ->, sizes, prev, pager, next, jumper',
    }

    const buttonAuth: ButtonAuth = {
        add: true,
        edit: true,
        delete: true,
    }

    const apiEndpoints: ApiEndpoints = {
        query: 'query',
        add: 'add',
        edit: 'edit',
        delete: 'delete',
        deleteFlag: 'deleteFlag',
    }

    customMerge(attrs, props.attrs ?? {})
    customMerge(table, props.table ?? {})
    customMerge(pagination, props.pagination ?? {})
    customMerge(buttonAuth, props.buttonAuth ?? {})
    customMerge(apiEndpoints, props.apiEndpoints ?? {})

    return {
        debug: props.debug ?? false,
        isAfterMountQuery: props.isAfterMountQuery ?? false,

        url: props.url!,
        rowKey: props.rowKey,
        rowKeys: props.rowKeys,

        source: props.source!,

        hooks: props.hooks ?? {},

        attrs,
        table,
        pagination,

        buttonAuth,
        apiEndpoints,
    }
}

/**
 * 合并两个对象。如果目标对象的属性存在并且是对象，则递归合并；
 * 如果源对象的属性是数组，则直接替换目标对象中的属性；
 * 其他情况下，用源对象的属性值覆盖目标对象。
 * @param target 目标对象，将在此对象上执行合并操作。
 * @param source 源对象，从其中获取属性值用于合并。
 * @returns 合并后的目标对象。
 */
export function customMerge<T, U>(target: T, source: U): T & U {
    // 验证输入是否为对象
    if (typeof target !== 'object' || target === null || typeof source !== 'object' || source === null) {
        console.error('两个参数都必须是对象.\n', { target, source })

        throw new Error('两个参数都必须是对象.')
    }

    // 自定义合并函数，当遇到数组时直接覆盖，而不是递归合并。
    const customizer = (objValue: any, srcValue: any) => {
        if (isArray(srcValue))
            return srcValue
    }

    return mergeWith(target, source, customizer)
}
