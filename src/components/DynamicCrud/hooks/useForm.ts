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
  const { definitions, fields: { filter, editor } } = configStore.source

  return defineStore(`${id}__form`, () => {
    const formVisible = ref(true)
    const drawerVisible = ref(false)
    const drawerTitle = ref<Exclude<FormModeType, 'Search'>>('Add')

    const _searchForm = {} as DefineForm<T>
    const searchForm = reactive({}) as DefineForm<T>
    const _editForm = {} as DefineForm<T>
    const editForm = reactive({}) as DefineForm<T>

    const currentRow = ref({} as T)
    const formData = ref<T | FormData>({} as T)

    Object.keys(definitions).forEach((key) => {
      const k = key as Extract<keyof T, string>
      if (filter.includes(k)) {
        _searchForm[k] = definitions[k].searchDefaultValue
        searchForm[k] = definitions[k].searchDefaultValue
      }
      if (editor.includes(k)) {
        _editForm[k] = definitions[k].addDefaultValue
        editForm[k] = definitions[k].addDefaultValue
      }
    })

    function reset(formEl: FormInstance | undefined, mode: Exclude<FormModeType, 'Add'>, close?: boolean) {
      if (close) {
        const isSearchMode = mode === 'Search'
        const original = isSearchMode ? _searchForm : _editForm
        const target = isSearchMode ? searchForm : editForm

        Object.keys(original).forEach((key) => {
          if (Object.prototype.hasOwnProperty.call(original, key))
            target[key as keyof DefineForm<T>] = original[key as keyof DefineForm<T>]
        })
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
