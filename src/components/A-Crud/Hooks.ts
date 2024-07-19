import { merge } from 'lodash'

import type { FormInstance } from 'element-plus'
import type { ActionHandler, ApiConfigType, CrudOptions, DrawerMode, Fields, FormStore, HooksConfig, ResetMode, Source, StringKeys, TableStore } from '.'
import HttpClient, { isCancel } from '@/utils/http'

export function useFormStore<T extends { [key: string]: any }>(source: Source<T>): FormStore<T> {
    const { fields: { filter, editor }, columns } = source

    const FormSearchRef = ref<FormInstance | null>(null)
    const FormEditRef = ref<FormInstance | null>(null)

    /**
     * 是否显示搜索表单
     * @default true
     */
    const formVisible = ref(true)
    /**
     * 是否显示 新增/编辑 抽屉
     * @default false
     */
    const drawerVisible = ref(false)
    /**
     * 抽屉标题
     * @default '新增' | '编辑'
     */
    const drawerTitle = ref<DrawerMode>('新增')

    /** 初始化的搜索表单参数 */
    const _searchForm = {} as T
    /** 搜索表单渲染值 */
    const searchForm = reactive({}) as T

    /** 初始化的新增/编辑表单参数 */
    const _editForm = {} as T
    /** 新增/编辑表单渲染值 */
    const editForm = reactive({}) as T

    /** 当前操作行数据 */
    const currentRow = ref({}) as Ref<T>
    /** 最终提交时的表单参数 */
    const formData = ref({}) as Ref<T>

    for (const key in columns) {
        if (filter.includes(key)) {
            _searchForm[key] = columns[key].searchDefaultValue as any
            searchForm[key] = columns[key].searchDefaultValue as any
        }

        if (editor.includes(key)) {
            _editForm[key] = columns[key].addDefaultValue as any
            editForm[key] = columns[key].addDefaultValue as any
        }
    }

    function reset(formEl: FormInstance | null, _mode: ResetMode) {
        if (!formEl)
            return
        formEl.resetFields()
    }

    return { FormSearchRef, FormEditRef, _searchForm, searchForm, _editForm, editForm, currentRow, formData, formVisible, drawerVisible, drawerTitle, reset }
}

export function useTableStore<T extends { [key: string]: any }>(source: Source<T>): TableStore<T> {
    const { fields: { column, expand } } = source
    /**
     * 表格加载状态
     * @default false
     */
    const loading = ref(false)

    /**
     * 表格数据
     */
    const tableData: Ref<T[]> = ref([])

    const checkColumn = ref([...column]) as Ref<StringKeys<T>[]>
    const tableColumns = computed(() => expand.filter(key => checkColumn.value.includes(key)) as StringKeys<T>[])

    // 分页属性
    const currentPage = ref(1)
    const pageSize = ref(10)
    const total = ref(0)

    const pageSizes = ref([10, 20, 30, 40, 50])
    const layout = ref('total, ->, sizes, prev, pager, next, jumper')

    return {
        loading,
        tableData,
        checkColumn,
        tableColumns,
        page: {
            currentPage,
            pageSize,
            total,
            pageSizes,
            layout,
        },
    }
}

export function useApiConfig(apiConfig: Partial<ApiConfigType>): ApiConfigType {
    const defaultConfig: ApiConfigType = {
        url: '',
        rowKey: '',
        rowKeys: [],
        actionsName: {
            query: 'query',
            add: 'add',
            edit: 'edit',
            delete: 'delete',
            deleteFlag: 'deleteFlag',
        },
        butAuthName: {
            add: false,
            edit: false,
            delete: false,
        },
    }
    return merge(defaultConfig, apiConfig)
}

export function useHooks<T>(hooks: HooksConfig<T>) {
    function hookHandler<K extends keyof HooksConfig<T>>(
        hookName: K,
        Data: Parameters<NonNullable<HooksConfig<T>[K]>>[0],
    ): ReturnType<NonNullable<HooksConfig<T>[K]>> {
        const func = hooks[hookName]

        if (func !== undefined && typeof func === 'function')
            return func(Data as any) as ReturnType<NonNullable<HooksConfig<T>[K]>>
        else
            return Data as any
    }

    return { hookHandler }
}

export function useActionHandler<T extends { [key: string]: any }>(Fields: Fields<T>, FormStore: FormStore<T>, TableStore: TableStore<T>, ApiConfig: ApiConfigType, hooks: HooksConfig<T> = {}): ActionHandler {
    const http = new HttpClient()

    const { editor } = Fields
    const { url, rowKey, rowKeys, actionsName } = ApiConfig
    const { drawerVisible, drawerTitle, searchForm, editForm, currentRow, formData } = FormStore
    const { loading, tableData, page: { currentPage, pageSize, total } } = TableStore
    const { hookHandler } = useHooks<T>(hooks)

    /** 查询 */
    function Query(params: any = {}) {
        loading.value = true
        formData.value = { ...searchForm, ...params }

        if (!hookHandler('beforeQueryHandler', FormStore))
            return

        http.CrudRequest<T[], T>({
            url: `${url}/${actionsName.query}`,
            data: { pagenum: currentPage.value, pagesize: pageSize.value, ...formData.value },
        },
        ).then((Res) => {
            const afterQueryResult = hookHandler('afterQueryHandler', Res.data)

            if (!afterQueryResult)
                return

            // 表格数据
            tableData.value = afterQueryResult

            // 总条数
            total.value = Res.page?.total || 0
            currentPage.value = Res.page?.pageNum || 0

            loading.value = false
        }).catch((error) => {
            if (!isCancel(error))
                loading.value = false
        })
    }
    /** 新增 */
    function Add() {
        drawerTitle.value = '新增'

        if (!hookHandler('beforeAddHandler', FormStore))
            return

        drawerVisible.value = true
    }
    /** 编辑 */
    function Edit(row: Record<string, any>) {
        drawerTitle.value = '编辑'
        currentRow.value = row as T

        editor.forEach(key => editForm[key] = row[key])

        if (!hookHandler('beforeEditHandler', FormStore))
            return

        drawerVisible.value = true
    }
    /** 删除 */
    function Remove(row: Record<string, any>) {
        formData.value = { ...getValueFromRow(row, rowKeys.length > 0 ? rowKeys : rowKey), deleteFlag: row.deleteFlag === 0 ? 1 : 0 } as any

        if (!hookHandler('beforeRemoveHandler', FormStore))
            return

        ElMessageBox.confirm('你确定要 删除 这行数据吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        })
            .then(() => {
                http.CrudRequest<T, T>({
                    url: `${url}/${actionsName.delete}`,
                    data: { ...formData.value },
                },
                ).then(() => {
                    if (!hookHandler('afteRemoveHandler', FormStore))
                        return
                    ElMessage({ type: 'success', message: '删除成功', grouping: true })
                })
            })
            .catch(() => { })
    }

    /** 表单提交 */
    async function Submit(formEl: FormInstance | null) {
        if (!formEl)
            return
        await formEl.validate((valid, fields) => {
            if (valid) {
                if (!hookHandler('beforeSubmitHandler', FormStore))
                    return

                drawerTitle.value === '新增' ? handleAdd() : handleEdit()
            }
            else {
                if (!hookHandler('submitValidateErr', { fields, FormStore }))
                    return

                console.log('error submit!', fields)
            }
        })
    }

    /** 新增操作 */
    function handleAdd() {
        formData.value = { ...editForm }
        if (!hookHandler('beforeSubmitAddHandler', FormStore))
            return

        console.log('执行新增')
        http.CrudRequest<T[], T>({
            url: `${url}/${actionsName.add}`,
            data: formData.value,
        },
        ).then(() => {
            if (!hookHandler('afterSubmitAddHandler', FormStore))
                return

            // 新增成功，直接查询新增的这一条数据
            Query({ ...editForm })

            drawerVisible.value = false
            ElMessage({ type: 'success', message: '新增成功', grouping: true })
        }).catch((error) => {
            if (!isCancel(error))
                loading.value = false
        })

        console.log('新增结束')
    }

    /** 编辑操作 */
    function handleEdit() {
        formData.value = { ...currentRow.value, ...editForm }

        if (!hookHandler('beforeSubmitEditHandler', FormStore))
            return

        http.CrudRequest<T[], T>({
            url: `${url}/${actionsName.edit}`,
            data: { ...formData.value },
        },
        ).then(() => {
            if (!hookHandler('afterSubmitEditHandler', FormStore))
                return

            if (rowKey) {
                // 修改成功，直接更新修改的数据，不进行查询，可使用钩子操作
                const idx = tableData.value.findIndex(i => i[rowKey] === formData.value?.[rowKey])

                Object.assign(tableData.value[idx], formData.value)
            }
            else {
                Query({ ...formData.value })
            }

            drawerVisible.value = false
            ElMessage({ type: 'success', message: '修改成功', grouping: true })
        }).catch((error) => {
            if (!isCancel(error))
                loading.value = false
        })
    }

    return { Query, Add, Edit, Remove, Submit }
}

export function InitCrudOptions<T extends { [key: string]: any }>(source: Source<T>, apiConfig: Partial<ApiConfigType>, hooks: HooksConfig<T> = {}): CrudOptions<T> {
    const { filter, editor, column, expand } = source.fields
    const Fields = { filter, editor, column, expand }
    const FormStore = useFormStore<T>(source)
    const TableStore = useTableStore<T>(source)
    const ApiConfig = useApiConfig(apiConfig)
    const ActionHandler = useActionHandler<T>(Fields, FormStore, TableStore, ApiConfig, hooks)

    return { source, hooks, ApiConfig, FormStore, TableStore, ActionHandler }
}

/** 计算表格高度，使表格刚好占满剩余高度，最低高度 457px */
export function useTableHeight(el: HTMLElement | null) {
    /** 表格高度 */
    return computed(() => {
        // 457 是表格刚好显示 10 条数据的高度，:deep(.el-table .cell) { height: 25px; }
        const mixHeight = 457
        // 20 为crud内边距、table内边距
        const cacleHeight = ref(-20 * 2 - 20 * 2)

        if (el) {
            const children = el.children
            const Hsearch = (children[0] as HTMLElement).offsetHeight
            const Haction = (children[1] as HTMLElement).offsetHeight
            const Hpagination = (children[3] as HTMLElement).offsetHeight

            cacleHeight.value += el.offsetHeight - Hsearch - Haction - Hpagination

            // console.log(Elvalue.offsetHeight, Hsearch, Haction, Hpagination, cacleHeight.value)
        }

        // return Math.max(mixHeight, cacleHeight.value)

        return mixHeight
    })
}

/**
 * 从行数据中获取指定键的值
 * @param row 完整的行数据
 * @param rowKey 需要获取的键
 * @returns 从row中获取到的键值对
 */
export function getValueFromRow(row: Record<string, any>, rowKey: string | string[]) {
    return typeof rowKey === 'string' ? { [rowKey]: row[rowKey] } : Object.fromEntries(rowKey.map(key => [key, row[key]]))
}
