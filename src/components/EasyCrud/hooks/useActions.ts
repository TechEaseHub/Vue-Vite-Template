import type { FormInstance } from 'element-plus'
import type { ComputedRef } from 'vue'

import type { BaseRow } from './base.types'
import type { ActionHandler } from './useActions.types'
import type { CrudConfig } from './useConfig.types'
import type { FormStore } from './useForm.types'
import type { TableStore } from './useTable.types'

import { useHooks } from './useHooks'

export function useActionHandler<T extends BaseRow>(config: ComputedRef<CrudConfig<T>>, formStore: FormStore<T>, tableStore: TableStore<T>): ActionHandler<T> {
  const http = new HttpClient({ timeout: 1000 * 10 })

  const { url, rowKey, rowKeys, apiEndpoints, hooks, source: { fields: { editor } } } = config.value
  const { drawerVisible, drawerTitle, searchForm, editForm, currentRow, formData } = formStore
  const { loading, tableData, page: { currentPage, pageSize, total } } = tableStore
  const { hookHandler } = useHooks<T>(hooks)

  /** 查询 */
  function Query(params: any = {}) {
    loading.value = true
    formData.value = { pagenum: currentPage.value, pagesize: pageSize.value, ...searchForm, ...params }

    if (!hookHandler('beforeQueryHandler', formStore))
      return

    http.EasyCrudRequest<T[], T>({
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

    if (!hookHandler('beforeAddHandler', formStore))
      return

    drawerVisible.value = true
  }

  /** 编辑 */
  function Edit(row: T) {
    drawerTitle.value = '编辑'
    currentRow.value = row as T
    // Object.assign(currentRow, row)

    editor.forEach(key => editForm[key] = row[key])

    if (!hookHandler('beforeEditHandler', formStore))
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
    // console.log(keyToUse, { rowKeys, rowKey }, formData)

    if (!hookHandler('beforeRemoveHandler', formStore))
      return

    ElMessageBox.confirm('你确定要 删除 这行数据吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(() => {
        http.EasyCrudRequest<T, T>({
          url: `${url}/${apiEndpoints?.delete}`,
          data: formData.value as T,
        },
        ).then(() => {
          if (!hookHandler('afteRemoveHandler', formStore))
            return
          ElMessage({ type: 'success', message: '删除成功', grouping: true })
        })
      })
      .catch(() => { })
  }

  /** 表单提交 */
  async function Submit(formEl: FormInstance | undefined) {
    if (!formEl)
      return
    await formEl.validate((valid, fields) => {
      if (valid) {
        if (!hookHandler('beforeSubmitHandler', formStore))
          return

        drawerTitle.value === '新增' ? handleAdd() : handleEdit()
      }
      else {
        // 执行自定义的错误处理，或者根据判断是执行用户的还是默认的处理
        if (!hookHandler('submitValidateErr', { fields, formStore }))
          return

        ElMessage.warning('参数校验错误')
        // console.log('error submit!', fields)
      }
    })
  }

  /** 新增操作 */
  function handleAdd() {
    formData.value = { ...editForm }
    // Object.assign(formData, { ...editForm })
    if (!hookHandler('beforeSubmitAddHandler', formStore))
      return

    http.EasyCrudRequest<T[], T>({
      url: `${url}/${apiEndpoints.add}`,
      data: formData.value as T,
    },
    ).then(() => {
      if (!hookHandler('afterSubmitAddHandler', formStore))
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
    // Object.assign(formData, { ...currentRow, ...editForm })

    if (!hookHandler('beforeSubmitEditHandler', formStore))
      return

    http.EasyCrudRequest<T[], T>({
      url: `${url}/${apiEndpoints.edit}`,
      data: formData.value as T,
    },
    ).then(() => {
      if (!hookHandler('afterSubmitEditHandler', formStore))
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
