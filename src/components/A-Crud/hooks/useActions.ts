import type { FormInstance } from 'element-plus'

import type { ActionHandler, BaseRow, CrudContext, FormStore, TableStore } from './index.types'
import { useHooks } from './useHooks'

import HttpClient, { isCancel } from '@/utils/http'

export function useActionHandler<T extends BaseRow>(context: CrudContext<T>, FormStore: FormStore<T>, TableStore: TableStore<T>): ActionHandler<T> {
    const http = new HttpClient({ timeout: 1000 * 10 })

    const { source: { fields: { editor } }, hooks = {}, url, rowKey, rowKeys, apiEndpoints } = context.config
    const { drawerVisible, drawerTitle, searchForm, editForm, currentRow, formData } = FormStore
    const { loading, tableData, page: { currentPage, pageSize, total } } = TableStore
    const { hookHandler } = useHooks<T>(hooks)

    /** 查询 */
    function Query(params: any = {}) {
        loading.value = true
        formData.value = { pagenum: currentPage.value, pagesize: pageSize.value, ...searchForm, ...params }

        if (!hookHandler('beforeQueryHandler', FormStore))
            return

        http.CrudRequest<T[], T>({
            url: `${url}/${apiEndpoints.query}`,
            data: formData.value as T,
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
    function Edit(row: T) {
        drawerTitle.value = '编辑'
        currentRow.value = row as T

        editor.forEach(key => editForm[key] = row[key])

        if (!hookHandler('beforeEditHandler', FormStore))
            return

        drawerVisible.value = true
    }
    /** 删除 */
    function Remove(row: T) {
        const keyToUse = rowKeys && rowKeys.length > 0 ? rowKeys : rowKey

        if (keyToUse === undefined) {
            console.warn('rowKey 和 rowKeys 均未定义')
            return undefined
        }

        formData.value = { ...getValueFromRow(row, keyToUse), deleteFlag: row.deleteFlag === 0 ? 1 : 0 } as T
        console.log(keyToUse, { rowKeys, rowKey }, formData.value)

        if (!hookHandler('beforeRemoveHandler', FormStore))
            return

        ElMessageBox.confirm('你确定要 删除 这行数据吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        })
            .then(() => {
                // http.CrudRequest<T, T>({
                //     url: `${url}/${apiEndpoints?.delete}`,
                //     data: formData.value as T,
                // },
                // ).then(() => {
                //     if (!hookHandler('afteRemoveHandler', FormStore))
                //         return
                //     ElMessage({ type: 'success', message: '删除成功', grouping: true })
                // })
            })
            .catch(() => { })
    }

    /** 表单提交 */
    async function Submit(formEl: FormInstance | undefined) {
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

        http.CrudRequest<T[], T>({
            url: `${url}/${apiEndpoints.add}`,
            data: formData.value,
        },
        ).then(() => {
            if (!hookHandler('afterSubmitAddHandler', FormStore))
                return

            // 新增成功，直接查询新增的这一条数据
            Query({ ...editForm })

            drawerVisible.value = false
            ElMessage({ type: 'success', message: '新增成功', grouping: true })
        })
    }

    /** 编辑操作 */
    function handleEdit() {
        formData.value = { ...currentRow.value, ...editForm }

        if (!hookHandler('beforeSubmitEditHandler', FormStore))
            return

        http.CrudRequest<T[], T>({
            url: `${url}/${apiEndpoints.edit}`,
            data: formData.value,
        },
        ).then(() => {
            if (!hookHandler('afterSubmitEditHandler', FormStore))
                return

            if (rowKey) {
                // 修改成功，直接更新修改的数据，不进行查询，可使用钩子操作
                const idx = tableData.value.findIndex(i => i[rowKey] === (formData.value as T)?.[rowKey])

                Object.assign(tableData.value[idx], formData.value)
            }
            else {
                Query({ ...formData.value })
            }

            drawerVisible.value = false
            ElMessage({ type: 'success', message: '修改成功', grouping: true })
        })
    }

    return { Query, Add, Edit, Remove, Submit }
}

/**
 * 从行数据中获取指定键的值
 * @param row 完整的行数据
 * @param rowKey 需要获取的键
 * @returns 从row中获取到的键值对
 */
export function getValueFromRow<T extends BaseRow>(row: T, rowKey: keyof T | (keyof T)[]) {
    return Array.isArray(rowKey)
        ? Object.fromEntries(rowKey.map(key => [key, row[key]]))
        : { [rowKey]: row[rowKey] }
}
