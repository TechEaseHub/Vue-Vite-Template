import type { BaseRow, CrudOptions, RequestResult } from '../index'

export function useHooks<T extends BaseRow>(hooks: HooksConfig<T>) {
  function hookHandler<
    K extends keyof HooksConfig<T>,
    F extends (...args: any) => any = NonNullable<HooksConfig<T>[K]>,
  >(
    hookName: K,
    data: Parameters<F>[0],
  ): ReturnType<F> {
    const func = hooks[hookName] as F
    return (func && typeof func === 'function')
      ? func(data)
      : data
  }

  return { hookHandler }
}

// 定义钩子函数类型
type HookFunction<T, R> = (data: T) => R

// 定义钩子配置接口
export interface HooksConfig<T extends BaseRow> {
  /** 查询之前 */
  beforeQueryHandler?: HookFunction<CrudOptions<T>, boolean>
  /** 查询之后 */
  afterQueryHandler?: HookFunction<RequestResult<T>['data'], RequestResult<T>['data']>

  /** 点击新增之前 */
  beforeAddHandler?: HookFunction<CrudOptions<T>, boolean>
  /** 点击新增之后 */
  beforeEditHandler?: HookFunction<CrudOptions<T>, boolean>

  /** 删除之前 */
  beforeRemoveHandler?: HookFunction<CrudOptions<T>, boolean>
  /** 删除之后 */
  afteRemoveHandler?: HookFunction<CrudOptions<T>, boolean>

  /** 表单提交之前 */
  beforeSubmitHandler?: HookFunction<CrudOptions<T>, boolean>
  /** 表单提交只后 */
  submitValidateErr?: HookFunction<{ fields: ValidateFieldsError | undefined, formStore: CrudOptions<T> }, boolean>

  /** 执行添加之前 */
  beforeSubmitAddHandler?: HookFunction<CrudOptions<T>, boolean>
  /** 执行添加之后 */
  afterSubmitAddHandler?: HookFunction<CrudOptions<T>, boolean>

  /** 执行编辑之前 */
  beforeSubmitEditHandler?: HookFunction<CrudOptions<T>, boolean>
  /** 执行编辑之后 */
  afterSubmitEditHandler?: HookFunction<CrudOptions<T>, boolean>
}

interface ValidateError {
  message?: string
  fieldValue?: any
  field?: string
}

type ValidateFieldsError = Record<string, ValidateError[]>
