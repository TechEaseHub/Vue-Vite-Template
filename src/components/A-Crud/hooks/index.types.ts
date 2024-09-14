import type { TableColumnCtx } from 'element-plus'

import type { ColumnsType, StringKeyOf } from './base.types'
import type { CrudConfig } from './useConfig.types'
import type { CrudOptions } from './useCrud.types'

export * from './base.types'
export * from './useConfig.types'

export * from './useCrud.types'

export * from './useForm.types'
export * from './useActions.types'
export * from './useTable.types'

export * from './useHooks.types'

/** 基础 CRUD 数据类型 */
export interface BaseRow {
    /**
     * 表格 type 对应列的类型
     * 'default' | 'selection' | 'index' | 'expand'
     * 如果设置了selection则显示多选框； 如果设置了 index 则显示该行的索引（从 1 开始计算）； 如果设置了 expand 则显示为一个可展开的按钮
     */
    /** 表格可选框 */
    readonly selection?: any
    /** 表格索引 */
    readonly index?: any
    /** 展开行 */
    readonly expand?: any

    // 数据模型 Base 字段
    /** 操作人账号 */
    readonly operatorName?: string
    /** 数据行状态 */
    deleteFlag?: 0 | 1
    /** 创建时间 */
    readonly createTime?: string
    /** 更新时间 */
    readonly updateTime?: string

    // 查询表单扩展字段
    /** startTime起始值 */
    startTimeStart?: string
    /** startTime终止值 */
    startTimeEnd?: string
    /** endTime起始值 */
    endTimeStart?: string
    /** endTime终止值 */
    endTimeEnd?: string
    /** 当前页 */
    pagenum?: number
    /** 分页大小 */
    pagesize?: number
}

/** CRUD 配置数据来源 */
export interface Source<T> {
    definitions: ColumnsType<T>
    fields: Fields<T>
}

export interface Fields<T> {
    filter: StringKeyOf<T>[]
    editor: StringKeyOf<T>[]
    expand: StringKeyOf<T>[]
    column: StringKeyOf<T>[]
}

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
    config: CrudConfig<T>
    emits: CrudEmits<T>
    slots: CrudSlots<T>
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
