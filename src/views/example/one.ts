import type { Ref } from 'vue'
import type { FormInstance } from 'element-plus'

export interface SearchForm {
    id?: number
    name?: string
    age?: number
}

export interface CrudRef {
    searchRef: FormInstance | null
    editorRef: FormInstance | null
}

export interface FormStore {
    searchForm: SearchForm
}

export interface UseStoreReturn {
    formStore: FormStore

    searchRef: Ref<FormInstance | null>
    editorRef: Ref<FormInstance | null>
}
