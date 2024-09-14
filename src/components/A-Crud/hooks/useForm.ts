import type { FormInstance } from 'element-plus'

import type { BaseRow, CrudContext, FormMode, FormStore } from './index.types'

export function useFormStore<T extends BaseRow>(context: CrudContext<T>): FormStore<T> {
    const { config: { source: { fields: { filter, editor }, definitions } }, emits } = context

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
                    console.log(`editForm: \`${key}\` changed \n from: ${oldVal} \n to: ${newVal}`)
                    emits('change:editForm', editForm, key)
                },
            )
        }
    }

    const currentRow = ref({}) as Ref<T>
    const formData = ref({}) as Ref<T | FormData>

    function reset(formEl: FormInstance | undefined, mode: Exclude<FormMode, '新增'>, close?: boolean) {
        // 如果是关闭重置表单参数
        if (close) {
            const forms = {
                搜索: _searchForm,
                编辑: _editForm,
            }

            const targetForm = mode === '搜索' ? searchForm : editForm
            for (const key in forms[mode]) {
                if (Object.prototype.hasOwnProperty.call(forms[mode], key))
                    targetForm[key] = forms[mode][key]
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
