import { type BaseRow, type ColumnsType, type Fields, ReCheckboxGroup, ReRadioGroup } from '@/components/DynamicCrud'
import ReSelect from '@/components/DynamicCrud/components/ReSelect.vue'

export interface Example extends BaseRow {
  /** 主键id */
  id: number
  /** 文本输入 */
  input: string
  /** 数字输入 */
  inputNum: number
  /** 搜索 */
  selector: number
  /** 单选 */
  radioButton: number
  /** 多选 */
  checkbox: number[]
  /** 日期 */
  date: string
  /** 日期范围 */
  dateRange: [string, string]
  /** 时间 */
  time: string
  /** 时间范围 */
  timeRange: [string, string]
  /** 开关 */
  switch: boolean
  /** 图片预览 URL */
  image: string
}

export const definitions: ColumnsType<Example> = reactive({
  id: {
    type: markRaw({}),
    label: '主键id',
  },
  input: {
    type: markRaw(ElInput),
    label: '输入框',
    searchDefaultValue: '输入框默认值',
  },
  inputNum: {
    type: markRaw(ElInputNumber),
    label: '数字框',
    searchDefaultValue: 123,
  },
  selector: {
    type: markRaw(ReSelect),
    label: '下拉框',
    searchDefaultValue: 1,
    componentProps: {
      options: [
        { label: '选项1', value: 1 },
        { label: '选项2', value: 2 },
        { label: '选项3', value: 3 },
      ],
    },
  },
  radioButton: {
    type: markRaw(ReRadioGroup),
    label: '单选框',
    componentProps: {
      isButton: true,
      options: [
        { label: '选项1', value: 1 },
        { label: '选项2', value: 2 },
        { label: '选项3', value: 3 },
      ],
    },
  },
  checkbox: {
    type: markRaw(ReCheckboxGroup),
    label: '多选框',
    componentProps: {
      isButton: true,
      options: [
        { label: '选项1', value: 1 },
        { label: '选项2', value: 2 },
        { label: '选项3', value: 3 },
      ],
    },
  },
  date: {
    type: markRaw(ElDatePicker),
    label: '日期',
    componentProps: {
      // type: 'date',
      format: 'YYYY-MM-DD',
      valueFormat: 'YYYY-MM-DD',
    },
  },
  dateRange: {
    type: markRaw(ElDatePicker),
    label: '日期范围',
    componentProps: {
      type: 'daterange',
      format: 'YYYY-MM-DD',
      valueFormat: 'YYYY-MM-DD',
    },
  },
  time: {
    type: markRaw(ElTimePicker),
    label: '时间',
    componentProps: {
      format: 'HH:mm:ss',
      valueFormat: 'HH:mm:ss',
    },
  },
  timeRange: {
    type: markRaw(ElTimePicker),
    label: '时间范围',
    componentProps: {
      isRange: true,
      format: 'HH:mm:ss',
      valueFormat: 'HH:mm:ss',
    },
  },
  switch: {
    type: markRaw(ElSwitch),
    label: '开关',
  },
  image: {
    type: markRaw({}),
    label: '图片预览 URL',
    render: () => {
      return h('div', { class: 'flex justify-center items-center' }, h(ElImage, {
        class: 'h24px',
        src: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
        fit: 'scale-down',
        previewTeleported: true,
        previewSrcList: ['https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'],
      }))
    },
  },
})

export const fields: Fields<Example> = {
  filter: ['input', 'inputNum', 'selector', 'radioButton', 'checkbox', 'date', 'dateRange', 'time', 'timeRange', 'switch'],
  editor: ['input', 'inputNum', 'selector', 'radioButton', 'checkbox', 'date', 'dateRange', 'time', 'timeRange', 'switch'],
  expand: ['id', 'input', 'inputNum', 'selector', 'radioButton', 'checkbox', 'date', 'dateRange', 'time', 'timeRange', 'switch', 'image'],
  column: ['input', 'inputNum', 'radioButton', 'image'],
}

console.log(Object.keys(definitions))
