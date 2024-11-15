import type { RequestResult } from './index.types'
import type { FormStore } from './useForm.types'

// 定义钩子函数类型
type HookFunction<T, R> = (data: T) => R

// 定义钩子配置接口
export interface HooksConfig<T> {
  /** 查询之前 */
  beforeQueryHandler?: HookFunction<FormStore<T>, boolean>
  /** 查询之后 */
  afterQueryHandler?: HookFunction<RequestResult<T>['data'], RequestResult<T>['data']>

  /** 点击新增之前 */
  beforeAddHandler?: HookFunction<FormStore<T>, boolean>
  /** 点击新增之后 */
  beforeEditHandler?: HookFunction<FormStore<T>, boolean>

  /** 删除之前 */
  beforeRemoveHandler?: HookFunction<FormStore<T>, boolean>
  /** 删除之后 */
  afteRemoveHandler?: HookFunction<FormStore<T>, boolean>

  /** 表单提交之前 */
  beforeSubmitHandler?: HookFunction<FormStore<T>, boolean>
  /** 表单提交只后 */
  submitValidateErr?: HookFunction<{ fields: ValidateFieldsError | undefined, formStore: FormStore<T> }, boolean>

  /** 执行添加之前 */
  beforeSubmitAddHandler?: HookFunction<FormStore<T>, boolean>
  /** 执行添加之后 */
  afterSubmitAddHandler?: HookFunction<FormStore<T>, boolean>

  /** 执行编辑之前 */
  beforeSubmitEditHandler?: HookFunction<FormStore<T>, boolean>
  /** 执行编辑之后 */
  afterSubmitEditHandler?: HookFunction<FormStore<T>, boolean>
}

interface ValidateError {
  message?: string
  fieldValue?: any
  field?: string
}

type ValidateFieldsError = Record<string, ValidateError[]>
