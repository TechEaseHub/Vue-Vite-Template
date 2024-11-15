import type { BaseRow, ColumnsItemType } from './hooks/index.types'
import ReDeleteFlag from './components/ReDeleteFlag.vue'
import ReRadioGroup from './components/ReRadioGroup.vue'
import { getValueFromRow } from './hooks/useActions'

export * from './hooks/index'
export * from './hooks/index.types'

export function CommonProps<T extends BaseRow>() {
  /**
   * ID Name 样式
   * @example
   * const ID: ColumnsItemType<T, keyof T> = {
   *   type: markRaw(ElInput),
   *   label: 'ID',
   *   tableProps: { width: 100, align: 'right' },
   * }
   */
  const Id: ColumnsItemType<T, keyof T> = {
    type: markRaw(ElInput),
    label: 'ID',
    tableProps: { width: 100, align: 'right' },
  }
  const Name: ColumnsItemType<T, keyof T> = {
    type: markRaw(ElInput),
    label: 'Name',
    tableProps: { width: 120 },
  }

  /**
   * 日期选择器
   * @example
   * const datePicker: ColumnsItemType<T, keyof T> = {
   *     type: markRaw(ElDatePicker),
   *     label: '日期选择器',
   *     componentProps: {
   *         type: 'date',
   *         format: 'YYYY-MM-DD',
   *         valueFormat: 'YYYY-MM-DD',
   *     },
   *     tableProps: { width: 110, align: 'center' },
   * }
   */
  const datePicker: ColumnsItemType<T, keyof T> = {
    type: markRaw(ElDatePicker),
    label: '日期选择器',
    componentProps: {
      type: 'date',
      format: 'YYYY-MM-DD',
      valueFormat: 'YYYY-MM-DD',
    },
    tableProps: { width: 110, align: 'center' },
  }
  /**
   * 日期时间选择器
   * @example
   * const datePicker: ColumnsItemType<T, keyof T> = {
   *   type: markRaw(ElDatePicker),
   *   label: '日期时间选择器',
   *   componentProps: {
   *     type: 'datetime',
   *     format: 'YYYY-MM-DD HH:mm:ss',
   *     valueFormat: 'YYYY-MM-DD HH:mm:ss',
   *   },
   *   tableProps: { width: 175, align: 'center' },
   * }
   */
  const datetimePicker: ColumnsItemType<T, keyof T> = {
    type: markRaw(ElDatePicker),
    label: '日期时间选择器',
    componentProps: {
      type: 'datetime',
      format: 'YYYY-MM-DD HH:mm:ss',
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
    tableProps: { width: 175, align: 'center' },
  }

  // 所有表的基础字段
  const operatorName: ColumnsItemType<T, 'operatorName'> = {
    type: markRaw({}),
    label: '操作人账号',
    tableProps: { width: 100, align: 'center' },
  }
  const deleteFlag: ColumnsItemType<T, 'deleteFlag'> = {
    type: markRaw(ReRadioGroup),
    label: '状态',
    searchDefaultValue: 0,
    componentProps: { options: [], isButton: true },
    tableProps: { width: 70, align: 'center' },
    render: ({ row }, { configStores }) => {
      const { url, apiEndpoints, rowKey, rowKeys } = configStores

      const keyToUse = rowKeys && rowKeys.length > 0 ? rowKeys : rowKey

      let formData = { deleteFlag: row.deleteFlag === 0 ? 1 : 0 }
      if (keyToUse) {
        formData = {
          ...getValueFromRow(row, keyToUse),
          deleteFlag: row.deleteFlag === 0 ? 1 : 0,
        }
      }

      return h(
        ReDeleteFlag,
        {
          'size': 'small',
          'modelValue': row.deleteFlag ?? 0,
          'onUpdate:modelValue': (newValue) => { row.deleteFlag = newValue },
          'url': `${url}/${apiEndpoints?.deleteFlag}`,
          'formData': formData,
        },
      )
    },
  }
  const createTime: ColumnsItemType<T, 'createTime'> = {
    type: markRaw({}),
    label: '创建时间',
    tableProps: { width: 175, align: 'center' },
  }
  const updateTime: ColumnsItemType<T, 'updateTime'> = {
    type: markRaw({}),
    label: '最后更新时间',
    tableProps: { width: 175, align: 'center' },
  }

  return {
    Id,
    Name,
    datePicker,
    datetimePicker,

    recId: Id,
    startTime: datePicker,
    endTime: datetimePicker,
    startTimeStart: datetimePicker,
    startTimeEnd: datetimePicker,
    endTimeStart: datetimePicker,
    endTimeEnd: datetimePicker,

    operatorName,
    deleteFlag,
    createTime,
    updateTime,
  }
}

/**
 * 类型保护函数，用于判断给定的数据是否为 FormData 类型。
 *
 * @template T - 泛型参数，表示传入的数据类型。
 * @param {T | FormData} data - 要检查的数据，可以是任意类型或 FormData 类型。
 * @returns {data is FormData} - 如果数据是 FormData 类型，则返回 true，否则返回 false。
 */
export function isFormData<T>(data: T | FormData): data is FormData {
  return data instanceof FormData
}
