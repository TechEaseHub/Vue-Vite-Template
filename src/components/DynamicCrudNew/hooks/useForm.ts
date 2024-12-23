import type { FormInstance } from 'element-plus'
import { useConfig } from './useConfig'

export type FormModeType = 'Add' | 'Edit' | 'Search'

export type UseFormReturnType<T> = ReturnType<typeof useForm<T>>
export function useForm<T>(id: string) {
  const configStore = useConfig<T>(id)

  const definitions = computed(() => configStore.source.definitions)
  const filter = computed(() => configStore.source.fields.filter)
  const editor = computed(() => configStore.source.fields.editor)

  const DefaultData: any = {
    filter: {},
    editor: {},
  }

  for (const key in definitions.value) {
    const k = key as Extract<keyof T, string>

    if (Object.prototype.hasOwnProperty.call(definitions.value, k)) {
      const element = definitions.value[k]
      if (filter.value?.includes(k))
        DefaultData.filter[k] = element.searchDefaultValue

      if (editor.value?.includes(k))
        DefaultData.editor[k] = element.addDefaultValue
    }
  }

  return defineStore(`${id}__form`, () => {
    const formVisible = ref<boolean>(true)
    const drawerVisible = ref<boolean>(false)
    const drawerTitle = ref<Exclude<FormModeType, 'Search'>>('Add')

    const _searchForm = DefaultData.filter
    const searchForm = reactive(DefaultData.filter)
    const _editForm = DefaultData.editor
    const editForm = reactive(DefaultData.editor)

    const currentRow = ref<T>()
    const formData = ref<T | FormData>()

    function reset(formEl: FormInstance | null, mode: Exclude<FormModeType, 'Add'>, close?: boolean) {
      if (close) {
        const isSearchMode = mode === 'Search'
        const original = isSearchMode ? _searchForm : _editForm
        const target = isSearchMode ? searchForm : editForm

        Object.assign(target, original)
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
