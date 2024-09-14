import type { Component, VNode } from 'vue'
import type { ElDrawer, ElForm, ElFormItem, ElPagination, ElTable, ElTableColumn, TableColumnInstance } from 'element-plus'

import type { CrudOptions } from './index.types'

/** 获取 T 类型中所有字符串键 */
export type StringKeyOf<T> = Extract<keyof T, string>

// 这两个类型有递归问题
/** 把 T 类型中的 K 属性设置为可选 */
export type MakePropertiesOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
/** 把 T 类型中除了 K 属性之外的属性设置为可选 */
export type MakeOtherPropertiesOptional<T, K extends keyof T> = Pick<T, K> & Partial<Omit<T, K>>

// 第三方组件实例类型
export type ElFormType = InstanceType<typeof ElForm>
export type ElFormItemType = InstanceType<typeof ElFormItem>
export type ElTableType = InstanceType<typeof ElTable>
export type ElTableColumnType = InstanceType<typeof ElTableColumn>
export type ElDrawerType = InstanceType<typeof ElDrawer>
export type ElPaginationType = InstanceType<typeof ElPagination>

type FormProps = ElFormItemType['$props'] & {
    search?: ElFormItemType['$props']
    edit?: ElFormItemType['$props']
}
type CompProps = Record<string, any> & {
    search?: Record<string, any>
    edit?: Record<string, any>
}

/** 表单模式 */
export type FormMode = '新增' | '编辑' | '搜索'

export type ColumnsType<T> = {
    [K in keyof T]: ColumnsItemType<T, K>
}

export interface ColumnsItemType<T, K extends keyof T> {
    /** 渲染的组件 */
    type: Component
    /** 标签 */
    label: string

    /** 新增/编辑模式 显示状态 */
    disabled?: (Mode: Exclude<FormMode, '搜索'>) => boolean
    /** 新增/编辑模式 显示状态 */
    visible?: (Mode: Exclude<FormMode, '搜索'>) => boolean
    /** ElCol 的 span 属性 */
    span?: number

    /** 搜索 表单默认值 */
    searchDefaultValue?: T[K]
    /** 新增/编辑 表单默认值 */
    addDefaultValue?: T[K]

    /** FormItem 属性 */
    formProps?: FormProps
    /** 表单渲染组件的属性 */
    componentProps?: CompProps
    /** TableColumn 属性 */
    tableProps?: TableColumnInstance['$props']

    /** 表格自定义渲染 */
    render?: (scope: { row: T, column: any, $index: number, crudOptions: CrudOptions<T> }) => VNode
}
