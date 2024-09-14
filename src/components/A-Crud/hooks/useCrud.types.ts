import type { Ref } from 'vue'
import type { FormInstance } from 'element-plus'

import type { ActionHandler, CrudConfig, FormStore, TableStore } from './index.types'

export interface CrudOptions<T> {
    /** Ref对象 */
    Ref: {
        /** 搜索表单Ref */
        SearchFormRef: Ref<FormInstance | undefined>
        /** 编辑表单Ref */
        EditFormRef: Ref<FormInstance | undefined>
    }
    config: CrudConfig<T>

    /** 搜索/编辑 表单数据对象 */
    formStores: FormStore<T>
    /** 表格数据对象 */
    tableStores: TableStore<T>
    actionHandler: ActionHandler<T>
}
