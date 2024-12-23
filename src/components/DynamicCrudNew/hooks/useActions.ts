import { useConfig } from './useConfig'
import { useForm } from './useForm'
import { useHooks } from './useHooks'
import { useTable } from './useTable'

export function useActionHandler<T>(id: string) {
  const configStore = useConfig<T>(id)
  const formStore = useForm<T>(id)
  const tableStore = useTable<T>(id)

  const crudOption = { configStore, formStore, tableStore }

  const { url, rowKey, rowKeys, apiEndpoints, source } = storeToRefs(configStore)
  const { drawerVisible, drawerTitle, searchForm, editForm, currentRow, formData } = storeToRefs(formStore)
  const { loading, tableData, currentPage, pageSize, total } = storeToRefs(tableStore)
  const { hookHandler } = useHooks(configStore.hooks)

  const http = new HttpClient({ timeout: 1000 * 10 })

  /** 查询 */
  function Query(params: any = {}) {
    loading.value = true
    formData.value = {
      ...{
        pagenum: currentPage.value,
        pagesize: pageSize.value,
      },
      ...searchForm.value,
      ...params,
    }

    if (!hookHandler('beforeQueryHandler', crudOption))
      return

    http.EasyCrudRequest<T[], T>({
      url: `${url.value}/${apiEndpoints.value.query}`,
      data: formData.value as T,
    }).then((Res) => {
      const afterQueryResult = hookHandler('afterQueryHandler', Res.data)

      if (!afterQueryResult)
        return

      // 表格数据
      tableData.value = afterQueryResult

      // 总条数
      total.value = Res.page?.total ?? 0
      currentPage.value = Res.page?.pageNum ?? 0

      loading.value = false
    }).catch((error) => {
      if (!isCancel(error))
        loading.value = false
    })
  }

  /** 新增 */
  function Add() {
    drawerTitle.value = 'Add'

    if (!hookHandler('beforeAddHandler', crudOption))
      return

    drawerVisible.value = true
  }

  /** 编辑 */
  function Edit(row: T) {
    drawerTitle.value = 'Edit'
    currentRow.value = row

    source.value.fields.editor.forEach(key => (editForm.value as any)[key] = row[key])

    if (!hookHandler('beforeEditHandler', crudOption))
      return

    drawerVisible.value = true
  }

  /** 删除 */
  function Remove(row: T) {
    const keyToUse = rowKeys.value?.length ? rowKeys.value : rowKey.value

    if (!keyToUse) {
      console.warn('rowKey 和 rowKeys 均未定义')
      return
    }

    formData.value = { ...getValueFromRow(row, keyToUse) } as T

    if (!hookHandler('beforeRemoveHandler', crudOption))
      return

    ElMessageBox.confirm('你确定要 删除 这行数据吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(() => {
      http.EasyCrudRequest<T, T>({
        url: `${url}/${apiEndpoints.value.delete}`,
        data: formData.value as T,
      }).then(() => {
        if (!hookHandler('afteRemoveHandler', crudOption))
          return
        ElMessage({ type: 'success', message: '删除成功', grouping: true })
      })
    }).catch(() => {})
  }

  return { Query, Add, Edit, Remove }
}

/**
 * 从行数据中获取指定键的值
 * @param row 完整的行数据
 * @param rowKey 需要获取的键
 * @returns 从row中获取到的键值对
 */
export function getValueFromRow<T>(row: T, rowKey: keyof T | (keyof T)[]) {
  return Array.isArray(rowKey)
    ? Object.fromEntries(rowKey.map(key => [key, row[key]]))
    : { [rowKey]: row[rowKey] }
}
