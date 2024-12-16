import type { InstancePropertyType } from './base.types'
import type { componentMapKey, ComponentPropsMap } from './component'

/** 创建基础行的数据类型 */
interface CreateBaseRow {
  name: string
}

/** 基础行的数据类型，包含可选的 id 字段 */
export interface BaseRow extends CreateBaseRow {
  id?: number
}

/** 表格单列配置类型 */
type ColumnsItemType<
  T extends BaseRow,
  V extends T[keyof T] = T[keyof T],
  Comp extends componentMapKey = componentMapKey, // 使用的组件类型
> = {
  [C in Comp]: {
    /** 组件类型 */
    type: C
    /** 列标签 */
    label: string
    /** 占位宽度 */
    span?: number
    /** 搜索时默认值 */
    searchDefaultValue?: V
    /** 新增时默认值 */
    addDefaultValue?: V
    /** 组件属性 */
    componentProps?: InstancePropertyType<ComponentPropsMap[C], '$props'>
    /** 组件插槽 */
    componentSlot?: InstancePropertyType<ComponentPropsMap[C], '$slots'>
  }
}[Comp]

/** 定义类型 */
export type ColumnsType<T extends BaseRow> = {
  [P in keyof T]: ColumnsItemType<T, T[P]>
}

/** 表格字段配置类型 */
export interface Fields<K> {
  /** 搜索表单字段 */
  filter: K[]
  /** 编辑表单字段 */
  editor: K[]
  /** 展开显示的列 */
  expand: K[]
  /** 默认显示的列 */
  column: K[]
}

/** 表格数据源类型 */
export interface Source<T extends BaseRow> {
  /** 定义 */
  definitions: ColumnsType<T>
  /** 显示配置 */
  fields: Fields<T>
}
