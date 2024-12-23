import type {
  ElDrawer,
  ElForm,
  ElFormItem,
  ElPagination,
  ElTable,
  ElTableColumn,
} from 'element-plus'

import type { InstanceProperty } from '../hooks/base.types'

import {
  ReCheckboxGroup,
  ReDeleteFlag,
  ReRadioGroup,
  ReSelect,
  ReUpload,
} from '../components'

/** 组件映射 */
export const ComponentMap = {
  // 第三方库原始组件
  Input: ElInput,
  Select: ElSelect,
  TimePicker: ElDatePicker,
  Dialog: ElDialog,
  Button: ElButton,

  // 自定义组件
  ReSelect,
  ReCheckboxGroup,
  ReDeleteFlag,
  ReRadioGroup,
  ReUpload,
} as const

/** 自动生成 ComponentPropertiesMap 类型 */
export type ComponentPropertiesMap = typeof ComponentMap
/** 组件映射的 key */
export type ComponentMapKey = keyof ComponentPropertiesMap

// 第三方组件实例类型
export type ElFormType = InstanceProperty<typeof ElForm, '$props'>
export type ElFormItemType = InstanceProperty<typeof ElFormItem, '$props'>
export type ElTableType = InstanceProperty<typeof ElTable, '$props'>
export type ElTableColumnType = InstanceProperty<typeof ElTableColumn, '$props'>
export type ElDrawerType = InstanceProperty<typeof ElDrawer, '$props'>
export type ElPaginationType = InstanceProperty<typeof ElPagination, '$props'>
