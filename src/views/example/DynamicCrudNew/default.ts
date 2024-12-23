import type { BaseRow, Source } from '@/components/DynamicCrudNew'

export interface Example extends BaseRow {
  /** 主键id */
  id: number
  /** 文本输入 */
  input: string
  /** 数字输入 */
  inputNum?: number
  /** 搜索 */
  selector?: number
  /** 单选 */
  radioButton?: number
  /** 多选 */
  checkbox?: number[]
  /** 日期 */
  date?: string
  /** 日期范围 */
  dateRange?: [string, string]
  /** 时间 */
  time?: string
  /** 时间范围 */
  timeRange?: [string, string]
  /** 开关 */
  switch?: boolean
  /** 图片预览 URL */
  image?: string
}

export const source: Source<Example, 'id' | 'input' | 'inputNum'> = {
  definitions: {
    id: {
      type: 'Input',
      label: '主键id',
      componentProps: {
        disabled: true,
        // options: [],
      },
    },
    input: {
      type: 'Input',
      label: '输入框',
      searchDefaultValue: '搜索默认值',
      addDefaultValue: '新增默认值',
    },
    inputNum: {
      type: 'ReSelect',
      label: '数字框',
      componentProps: {
        options: [],
        // disabled: true,
      },
    },
  },
  fields: {
    filter: ['input', 'inputNum'],
    editor: ['input', 'inputNum'],
    expand: ['id', 'input', 'inputNum'],
    column: ['input', 'inputNum'],
  },
}

console.log(Object.keys(source.definitions))
