import { getValueFromRow } from './Hooks'
import type { BaseRow, ColumnsItemType } from './Type'
import ReDeleteFlag from './components/ReDeleteFlag.vue'
import ReRadioGroup from './components/ReRadioGroup.vue'

export { default as CrudSearchForm } from './src/SearchForm.vue'
export { default as CrudActionArea } from './src/ActionArea.vue'
export { default as CrudTable } from './src/Table.vue'
export { default as CrudDrawer } from './src/EditForm.vue'

export * from './Type'
export * from './Hooks'

export { default as ReDeleteFlag } from './components/ReDeleteFlag.vue'
export { default as ReSelect } from './components/ReSelect.vue'
export { default as ReRadioGroup } from './components/ReRadioGroup.vue'
export { default as ReCheckboxGroup } from './components/ReCheckboxGroup.vue'

export function CommonProps<T extends BaseRow>() {
    const operatorName: ColumnsItemType<T> = {
        type: markRaw(ElInput),
        label: '操作人账号',
    }
    const deleteFlag: ColumnsItemType<T> = {
        type: markRaw(ReRadioGroup),
        label: '状态',
        searchDefaultValue: 0,
        componentProps: { options: [], isButton: true },
        tableProps: { width: 70, align: 'center' },
        render: ({ row, crudOptions }) => {
            const { url, actionsName, rowKey, rowKeys } = crudOptions.ApiConfig
            const formData = { ...getValueFromRow(row, rowKeys.length > 0 ? rowKeys : rowKey), deleteFlag: row.deleteFlag === 0 ? 1 : 0 }

            return h(
                ReDeleteFlag,
                {
                    'size': 'small',
                    'modelValue': row.deleteFlag,
                    'onUpdate:modelValue': (newValue) => { row.deleteFlag = newValue },
                    'url': `${url}/${actionsName.deleteFlag}`,
                    'formData': formData,
                },
            )
        },
    }
    const createTime: ColumnsItemType<T> = {
        type: markRaw(ElInput),
        label: '创建时间',
    }
    const updateTime: ColumnsItemType<T> = {
        type: markRaw(ElInput),
        label: '更新时间',
    }
    return { operatorName, deleteFlag, createTime, updateTime }
}
