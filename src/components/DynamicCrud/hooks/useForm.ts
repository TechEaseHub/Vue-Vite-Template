import type { FormInstance } from 'element-plus'
import type { BaseRow } from '../index'
import { useConfig } from '../index'

export type FormModeType = 'Add' | 'Edit' | 'Search'

export type DefineForm<T> = {
  [K in Extract<keyof T, string>]: T[K] | undefined;
}
export type UseFormReturnType<T extends BaseRow> = ReturnType<typeof useForm<T>>
export function useForm<T extends BaseRow>(id: string) {
  const configStore = useConfig<T>(id)
  const definitions = configStore.source.definitions
  const filter = configStore.source.fields.filter
  const editor = configStore.source.fields.editor

  return defineStore(`${id}__form`, () => {
    const formVisible = ref(true)
    const drawerVisible = ref(false)
    const drawerTitle = ref<Exclude<FormModeType, 'Search'>>('Add')

    // 表单数据定义
    const _searchForm = {} as DefineForm<T>
    const searchForm = reactive({}) as DefineForm<T>
    const _editForm = {} as DefineForm<T>
    const editForm = reactive({}) as DefineForm<T>

    const currentRow = ref({} as T)
    const formData = ref<T | FormData>({} as T)

    // 对表单参数进行初始化赋值，并添加改变监听事件
    for (const key in definitions) {
      if (filter.includes(key)) {
        _searchForm[key] = definitions[key].searchDefaultValue
        searchForm[key] = definitions[key].searchDefaultValue
      }

      if (editor.includes(key)) {
        _editForm[key] = definitions[key].addDefaultValue
        editForm[key] = definitions[key].addDefaultValue
      }
    }

    function reset(formEl: FormInstance | undefined, mode: Exclude<FormModeType, 'Add'>, close?: boolean) {
      if (close) {
        const isSearchMode = mode === 'Search'
        const original = isSearchMode ? _searchForm : _editForm
        const target = isSearchMode ? searchForm : editForm

        // 复制原始表单的数据到目标表单
        for (const key in original) {
          if (Object.prototype.hasOwnProperty.call(original, key))
            target[key as keyof DefineForm<T>] = original[key as keyof DefineForm<T>]
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
  })()
}
