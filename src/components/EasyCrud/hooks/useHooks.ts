import type { BaseRow } from './base.types'
import type { HooksConfig } from './useHooks.types'

export function useHooks<T extends BaseRow>(hooks: HooksConfig<T>) {
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
