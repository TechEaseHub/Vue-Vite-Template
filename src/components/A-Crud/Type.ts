import type { Component, Ref, ToRefs, VNode } from 'vue'
import type { DrawerProps, FormInstance, FormItemInstance, PaginationProps, TableColumnInstance, TableInstance } from 'element-plus'

export interface BaseRow {
    /** 表格可选框 */
    readonly selection?: any
    /** 表格索引 */
    readonly index?: any
    /** 操作人账号 */
    operatorName: string
    /** 数据行状态 */
    deleteFlag: 0 | 1
    /** 创建时间 */
    createTime: string
    /** 更新时间 */
    updateTime: string
}

export interface RequestResult<T> {
    /** 后端返回的状态码 */
    code: number
    /** 处理消息 */
    message: string
    /** 数据 */
    data: T[]
    /** 分页 */
    page: ResPage
}

export interface Props<T> {
    apiConfig: Partial<ApiConfigType>
    source: Source<T>
    attrs?: Attrs
    hooks?: HooksConfig<T>
}

export interface CrudOptions<T> {
    source: Source<T>
    hooks: HooksConfig<T>
    ApiConfig: ApiConfigType
    FormStore: FormStore<T>
    TableStore: TableStore<T>
    ActionHandler: ActionHandler
}

export interface Source<T = any> {
    fields: Fields<T>
    columns: ColumnsType<T>
}

export type ColumnsType<T> = {
    [K in keyof T]: ColumnsItemType<T>
}

export interface Attrs {
    /** 表单配置 */
    form?: FormInstance['$props']
    /** 表单抽屉配置 */
    drawer?: Partial<DrawerProps>
    /** 表格配置 */
    table?: TableInstance['$props'] & Partial<TableInstance['$emit']>
    /** 分页配置 */
    pagination?: Partial<PaginationProps>
}

export interface Fields<T> {
    filter: StringKeys<T>[]
    editor: StringKeys<T>[]
    expand: StringKeys<T>[]
    column: StringKeys<T>[]
}

export interface ColumnsItemType<T> {
    /** 渲染的组件 */
    type: Component
    /** 标签 */
    label: string
    /** 新增/编辑模式 显示状态 */
    disabled?: (Mode: DrawerMode) => boolean
    /** 新增/编辑模式 显示状态 */
    visible?: (Mode: DrawerMode) => boolean
    /** 搜索 表单默认值 */
    searchDefaultValue?: number | string
    /** 新增/编辑 表单默认值 */
    addDefaultValue?: number | string
    /** ElCol 的 span 属性 */
    span?: number
    /** FormItem 属性 */
    formProps?: {
        search?: FormItemInstance['$props']
        edit?: FormItemInstance['$props']
    } & FormItemInstance['$props']
    /** 表单渲染组件的属性 */
    componentProps?: {
        search?: Record<string, any>
        edit?: Record<string, any>
    } & Record<string, any>
    /** TableColumn 属性 */
    tableProps?: TableColumnInstance['$props']
    /** 表格自定义渲染 */
    render?: (scope: { row: T, column: any, $index: number, crudOptions: CrudOptions<T> }) => VNode
};

export interface ApiConfigType {
    /** 当前页面根url */
    url: string
    /** 表格主键 */
    rowKey: string
    /** 多主键 */
    rowKeys: string[]
    /** 接口名称映射 */
    actionsName: {
        query?: string
        add?: string
        edit?: string
        delete?: string
        deleteFlag?: string
    }
    /** 操作按钮权限 */
    butAuthName: {
        add?: boolean
        edit?: boolean
        delete?: boolean
    }
}

export interface ResPage {
    /** 当前页 */
    pageNum?: number
    /** 分页大小 */
    pageSize?: number
    /** 总页数 */
    pages?: number
    /** 总条数 */
    total?: number
}

export interface Page {
    /* 当前页 */
    currentPage: number
    /* 每页条数 */
    pageSize: number
    /* 总条数 */
    total: number
}

/** 分页属性 */
export interface Pagination extends Page {
    /* 每页条数选项 */
    pageSizes: number[]
    /* 布局 */
    layout: string
}

/** 重置模式 */
export type ResetMode = 'search' | 'edit'
/** 抽屉模式 */
export type DrawerMode = '新增' | '编辑'

export type StringKeys<T> = Extract<keyof T, string>

/** 表单属性 */
export interface FormStore<T> {
    FormSearchRef: Ref<FormInstance | null>
    FormEditRef: Ref<FormInstance | null>

    /** 搜索表单初始值 */
    _searchForm: T
    /** 搜索表单 */
    searchForm: T

    /** 编辑表单初始值 */
    _editForm: T
    /** 编辑表单 */
    editForm: T

    /** 当前操作行数据 */
    currentRow: Ref<T>
    /** 最终提交时的表单参数 */
    formData: Ref<T>

    /** 表单是否可见 */
    formVisible: Ref<boolean>
    /**
     * 表单重置
     * @param mode 重置模式 search: 搜索表单, edit: 编辑表单
     */
    reset: (formEl: FormInstance | null, mode: ResetMode) => void

    /** 抽屉是否可见 */
    drawerVisible: Ref<boolean>
    /** 抽屉标题 */
    drawerTitle: Ref<DrawerMode>
}

/** 表格属性 */
export interface TableStore<T> {
    /** 表格加载状态 */
    loading: Ref<boolean>
    /** 表格数据 */
    tableData: Ref<T[]>
    /** 选中的表格列 */
    checkColumn: Ref<StringKeys<T>[]>
    /** 表格列（根据配置的顺序） */
    tableColumns: Ref<StringKeys<T>[]>
    /** 分页属性 */
    page: ToRefs<Pagination>
}
/** 操作处理函数 */
export interface ActionHandler {
    Query: () => void
    Add: () => void
    Edit: (row: Record<string, any>) => void
    Remove: (row: Record<string, any>) => void
    Submit: (formEl: FormInstance | null) => void
}

// 定义钩子函数类型
type HookFunction<T, R> = (data: T) => R
// 定义钩子配置接口
export interface HooksConfig<T> {
    /** 查询之前 */
    beforeQueryHandler?: HookFunction<FormStore<T>, boolean>
    /** 查询之后 */
    afterQueryHandler?: HookFunction<RequestResult<T>['data'], RequestResult<T>['data']>

    beforeAddHandler?: HookFunction<FormStore<T>, boolean>
    beforeEditHandler?: HookFunction<FormStore<T>, boolean>
    beforeRemoveHandler?: HookFunction<FormStore<T>, boolean>
    afteRemoveHandler?: HookFunction<FormStore<T>, boolean>
    beforeSubmitHandler?: HookFunction<FormStore<T>, boolean>
    submitValidateErr?: HookFunction<{ fields: any, FormStore: FormStore<T> }, boolean>
    beforeSubmitAddHandler?: HookFunction<FormStore<T>, boolean>
    afterSubmitAddHandler?: HookFunction<FormStore<T>, boolean>
    beforeSubmitEditHandler?: HookFunction<FormStore<T>, boolean>
    afterSubmitEditHandler?: HookFunction<FormStore<T>, boolean>
}
