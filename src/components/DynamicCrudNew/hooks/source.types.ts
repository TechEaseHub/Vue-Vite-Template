import type { CrudOptions } from '..'
import type { ComponentMapKey, ComponentPropertiesMap, ElFormItemType, ElTableColumnType } from '../config'
import type { InstanceProperty, StringKeyOf } from './base.types'
import type { FormModeType } from './useForm'

/** 页面单字段配置类型 */
export type FieldConfig<T, V, Comp extends ComponentMapKey = ComponentMapKey> = {
  [C in Comp]: {
    /** 组件类型 */
    type: C
    /** 列标签 */
    label: string

    /** 新增/编辑模式 表单禁用状态 */
    disable?: (mode: Exclude<FormModeType, 'Search'>) => boolean
    /** 新增/编辑模式 表单显示状态 */
    visible?: (mode: Exclude<FormModeType, 'Search'>) => boolean
    /** 占位宽度 */
    span?: number

    /** 搜索表单默认值 */
    searchDefaultValue?: V
    /** 新增表单时默认值 */
    addDefaultValue?: V

    /** FormItem 属性 */
    formProps?: FormProps
    /** 组件属性 */
    componentProps?: CompProps<C>
    /** 组件插槽 */
    componentSlot?: InstanceProperty<ComponentPropertiesMap[C], '$slots'>
    /** TableColumn 属性 */
    tableProps?: ElTableColumnType

    /** 表格自定义渲染 */
    render?: (scope: { row: T, column: any, $index: number }, options: CrudOptions<T>) => VNode
  }
}[Comp]

/** 通用的模式属性映射类型 */
type ModeProps<T, Modes extends string> = T & Partial<Record<Modes, T>>

/** 优化后的 FormProps 使用 ModeProps */
type FormProps = ModeProps<ElFormItemType, 'search' | 'edit'>

/** 优化后的 CompProps 使用 ModeProps */
type CompProps<C extends ComponentMapKey> = ModeProps<
  InstanceProperty<ComponentPropertiesMap[C], '$props'>,
  'search' | 'edit'
>

/** 页面字段定义类型 */
export type FieldDefinitions<T, K extends keyof T = StringKeyOf<T>> = {
  [P in K]: FieldConfig<T, T[P]>
}

/** 页面字段展示分类 */
export interface DisplayFields<K> {
  /** 搜索表单字段 */
  filter: Array<K>
  /** 编辑表单字段 */
  editor: Array<K>
  /** 展开显示的列 */
  expand: Array<K>
  /** 默认显示的列 */
  column: Array<K>
}

/** 页面数据源类型 */
export interface Source<T, K extends keyof T = StringKeyOf<T>> {
  /** 定义 */
  definitions: FieldDefinitions<T, K>
  /** 显示配置 */
  fields: DisplayFields<K>
}
