import type { ElDrawer, ElForm, ElFormItem, ElPagination, ElTable, ElTableColumn, TableColumnInstance } from 'element-plus'
import type { Component, VNode } from 'vue'
import type { CrudOptions } from './index.types'
import type { FormMode } from './useForm.types'

/** 获取 T 类型中所有字符串键 */
export type StringKeyOf<T> = Extract<keyof T, string>

// 第三方组件实例类型
export type ElFormType = InstanceType<typeof ElForm>
export type ElFormItemType = InstanceType<typeof ElFormItem>
export type ElTableType = InstanceType<typeof ElTable>
export type ElTableColumnType = InstanceType<typeof ElTableColumn>
export type ElDrawerType = InstanceType<typeof ElDrawer>
export type ElPaginationType = InstanceType<typeof ElPagination>

/** 基础 EasyCrud 数据类型 */
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

/** EasyCrud 配置数据来源 */
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
  render?: (scope: { row: T, column: any, $index: number }, crudOptions: CrudOptions<T>) => VNode
}

type FormProps = ElFormItemType['$props'] & {
  search?: ElFormItemType['$props']
  edit?: ElFormItemType['$props']
}
type CompProps = Record<string, any> & {
  search?: Record<string, any>
  edit?: Record<string, any>
}
