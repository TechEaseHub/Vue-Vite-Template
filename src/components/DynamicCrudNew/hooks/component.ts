import { ReSelect } from '@/components/DynamicCrud'

// 组件映射
export const componentMap = {
  input: ElInput,
  orgSelect: ElSelect,
  select: ReSelect,
  timePicker: ElDatePicker,
  dialog: ElDialog,
  button: ElButton,
}

// 自动生成 ComponentPropsMap 类型
export type ComponentPropsMap = typeof componentMap
// 组件映射的 key
export type componentMapKey = keyof ComponentPropsMap
