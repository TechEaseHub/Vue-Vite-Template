import type { FormInstance } from 'element-plus'
import type { ComputedRef } from 'vue'

import type { BaseRow } from './base.types'
import type { CrudEmits } from './index.types'
import type { CrudConfig } from './useConfig.types'
import type { FormMode, FormStore } from './useForm.types'

export function useFormStore<T extends BaseRow>(config: ComputedRef<CrudConfig<T>>, emits: CrudEmits<T>): FormStore<T> {
  const { source: { definitions, fields: { filter, editor } }, debug } = config.value

  const formVisible = ref(true)
  const drawerVisible = ref(false)
  const drawerTitle = ref<Exclude<FormMode, '搜索'>>('新增')

  const _searchForm = {} as T
  const searchForm = reactive({}) as T
  const _editForm = {} as T
  const editForm = reactive({}) as T

  // 对表单参数进行初始化赋值，并添加改变监听事件
  for (const key in definitions) {
    if (filter.includes(key)) {
      _searchForm[key] = definitions[key].searchDefaultValue!
      searchForm[key] = definitions[key].searchDefaultValue!
      watch(
        () => searchForm[key],
        (newVal, oldVal) => {
          if (debug)
            console.log(`searchForm: \`${key}\` changed \n from: ${oldVal} \n to: ${newVal}`)
          emits('change:searchForm', searchForm, key)
        },
      )
    }

    if (editor.includes(key)) {
      _editForm[key] = definitions[key].addDefaultValue!
      editForm[key] = definitions[key].addDefaultValue!
      watch(
        () => editForm[key],
        (newVal, oldVal) => {
          if (debug)
            console.log(`editForm: \`${key}\` changed \n from: ${oldVal} \n to: ${newVal}`)
          emits('change:editForm', editForm, key)
        },
      )
    }
  }

  const currentRow = ref({}) as Ref<T>
  const formData = ref({}) as Ref<T | FormData>

  function reset(formEl: FormInstance | undefined, mode: Exclude<FormMode, '新增'>, close?: boolean) {
    console.log(123, formEl, mode, close)

    if (close) {
      const isSearchMode = mode === '搜索'
      const original = isSearchMode ? _searchForm : _editForm
      const target = isSearchMode ? searchForm : editForm

      // 复制原始表单的数据到目标表单
      for (const key in original) {
        if (Object.prototype.hasOwnProperty.call(original, key))
          target[key] = original[key]
      }
    }
    else {
      formEl?.resetFields()
    }
  }

  return {
    formVisible,
    drawerVisible,
    drawerTitle,

    _searchForm,
    searchForm,
    _editForm,
    editForm,

    currentRow,
    formData,

    reset,
  }
}
