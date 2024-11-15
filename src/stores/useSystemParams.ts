import { SHA256 } from 'crypto-js'

type ValueOf<T> = T[keyof T]
export type KeysOf<T> = Extract<keyof T, string>
export interface MapValueType {
  key: string
  value?: (item: SystemParamsItem) => ValueOf<SystemParamsItem>
  label?: (item: SystemParamsItem) => ValueOf<SystemParamsItem>
  disabled?: (item: SystemParamsItem) => boolean
}
export interface ResultType {
  value: ValueOf<SystemParamsItem>
  label: ValueOf<SystemParamsItem>
  disabled: boolean
}
/**
 * SystemParamsItem 接口定义，用于描述系统参数的结构。
 */
interface SystemParamsItem {
  /** 查询的键 */
  classKey: string
  /** 数字类型的值 */
  itemId: number
  /** 字符串类型的值 */
  itemKey: string
  /** 标签值 */
  itemValue: string
  /** 值描述 */
  itemDesc: string
}

/**
 * 获取系统参数的方法，通过 HTTP 请求获取。
 * @param data 包含查询键列表的对象。
 * @param data.classKeyList 要查询的键列表。
 * @returns 包含系统参数项二维数组的 Promise。
 */
function getSystemParamsByKeys(data: { classKeyList: string[] }) {
  return Http.EasyCrudRequest<SystemParamsItem[][]>({
    url: '/sysParam/getClasses',
    data,
    isCancelToken: false,
  })
}

export const useSystemParamsStore = defineStore('systemParams', () => {
  /**
   * 缓存的到期时间，单位为毫秒（8小时）。
   */
  const EXPIRATION_TIME = 1000 * 60 * 60 * 8

  /**
   * 缓存的数据，使用字符串键映射到 ResultType 数组。
   */
  const cacheKeys: Record<string, ResultType[]> = reactive({})

  /**
   * 缓存的键的到期时间，使用字符串键映射到时间戳。
   */
  const cacheKeysExpTime: Record<string, number> = reactive({})

  /**
   * 将 MapValueType 对象中的函数转换为字符串，以便进行哈希计算。
   * @param obj MapValueType 对象。
   * @returns 对象的字符串表示形式。
   */
  function _stringifyWithFunctions(obj: MapValueType): string {
    return JSON.stringify(obj, (_key, value) => typeof value === 'function' ? value.toString() : value)
  }

  /**
   * 生成哈希键的方法，根据 MapValueType 对象生成 SHA256 哈希，并截取前 8 位作为缓存键的一部分。
   * @param k 原始键（字符串）。
   * @param v MapValueType 对象。
   * @returns 生成的哈希键字符串。
   */
  function _getHashKey(k: string, v: MapValueType): string {
    return `${k}_${SHA256(_stringifyWithFunctions(v)).toString().substring(0, 8)}`
  }

  /**
   * 检查缓存是否有效的方法。
   * @param cacheKey 缓存的键。
   * @returns 如果缓存有效则返回 true，否则返回 false。
   */
  function _isCacheValid(cacheKey: string): boolean {
    return cacheKeys[cacheKey] && cacheKeysExpTime[cacheKey] > Date.now()
  }

  /**
   * 更新缓存的方法，将结果存入缓存并设置到期时间。
   * @param cacheKey 缓存的键。
   * @param options 要缓存的结果数组。
   */
  function _updateCache(cacheKey: string, options: ResultType[]) {
    cacheKeys[cacheKey] = options
    cacheKeysExpTime[cacheKey] = Date.now() + EXPIRATION_TIME
  }

  /**
   * 获取系统参数的方法，支持从缓存中读取或从服务器获取。
   * @param mapList 包含查询键和值映射的 Map 对象。
   * @returns 包含结果类型的 Map 对象。
   */
  async function GetSystemParams<T>(mapList: Map<KeysOf<T>, MapValueType>): Promise<Map<KeysOf<T>, ResultType[]>> {
    // console.log('GetSystemParams', mapList)
    /** 存储最终结果的 Map */
    const Result = new Map<KeysOf<T>, ResultType[]>()
    /** 未缓存的 key 列表，将用于发起新请求 */
    const noCacheKeys: string[] = []
    /** 全部请求的 key 列表 */
    const requestKeys: string[] = []
    /** 列的 keys 列表 */
    const columnsKeys: KeysOf<T>[] = []

    // 遍历 mapList 检查缓存状态
    mapList.forEach((v, k) => {
      /** 生成缓存键名 */
      const cacheKey = _getHashKey(k, v)
      columnsKeys.push(k)
      requestKeys.push(v.key)

      if (_isCacheValid(cacheKey))
        Result.set(k, cacheKeys[cacheKey])
      else
        noCacheKeys.push(v.key)
    })

    // 如果有未缓存的 key，则发起请求
    if (noCacheKeys.length > 0) {
      const { data } = await getSystemParamsByKeys({ classKeyList: noCacheKeys })

      data.forEach((items) => {
        if (items.length > 0) {
          const idx = requestKeys.indexOf(items[0].classKey) // 获取当前项的索引
          const MapKey = columnsKeys[idx] // 获取列 key
          const Param = mapList.get(MapKey) // 获取对应的参数设置

          if (Param) {
            const cacheKey = _getHashKey(MapKey, Param) // 生成新的缓存 key

            // 生成结果项，包含 value、label 和 disabled 状态
            const options = items.map(item => ({
              value: Param.value ? Param.value(item) : item.itemId,
              label: Param.label ? Param.label(item) : item.itemValue,
              disabled: Param.disabled ? Param.disabled(item) : false,
            }))

            Result.set(MapKey, options) // 将结果存储到 Result
            _updateCache(cacheKey, options) // 更新缓存
          }
        }
      })
    }

    return Result
  }

  return {
    /**
     * 缓存的数据，使用字符串键映射到 ResultType 数组。
     */
    cacheKeys,
    /**
     * 缓存的键的到期时间，使用字符串键映射到时间戳。
     */
    cacheKeysExpTime,
    /**
     * 获取系统参数的方法，支持从缓存中读取或从服务器获取。
     * @param mapList 包含查询键和值映射的 Map 对象。
     * @returns 包含结果类型的 Map 对象。
     */
    GetSystemParams,
  }
}, { persist: true })
