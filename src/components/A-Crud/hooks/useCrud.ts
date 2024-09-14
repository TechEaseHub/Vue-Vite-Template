import type { FormInstance } from 'element-plus'

import type { BaseRow, CrudContext, CrudOptions } from './index.types'
import { useActionHandler, useFormStore, useTableStore } from './index'

export function useCrud<T extends BaseRow>(context: CrudContext<T>): CrudOptions<T> {
    const { config } = context

    const SearchFormRef = ref<FormInstance>()
    const EditFormRef = ref<FormInstance>()

    const formStores = useFormStore(context)
    const tableStores = useTableStore(context)
    const actionHandler = useActionHandler(context, formStores, tableStores)

    return {
        Ref: { SearchFormRef, EditFormRef },
        config,

        formStores,
        tableStores,
        actionHandler,
    }
}
