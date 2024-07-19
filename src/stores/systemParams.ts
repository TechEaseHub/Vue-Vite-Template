import { Http } from '@/utils/http'

export type ValueOf<T> = T[keyof T]
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

export const systemParamsStore = defineStore(
    'systemParams',
    () => {
        const cacheKeys: Record<string, ResultType[]> = reactive({})
        const cacheKeysExpTime: Record<string, number> = reactive({})
        const ExpTime = 1000 * 60 * 60 * 8

        async function GetSystemParams<T>(mapList: Map<KeysOf<T>, MapValueType>) {
            /** 返回结果 */
            const Result = new Map<KeysOf<T>, ResultType[]>([])
            const noCache: string[] = []

            /** 赋值时的键 */
            const ColumnsKeys: string [] = []
            const RequestKeys: string[] = []

            // 判断缓存是否存在
            mapList.forEach((v, k) => {
                ColumnsKeys.push(k)
                RequestKeys.push(v.key)

                if (cacheKeys[k] && cacheKeysExpTime[k] && cacheKeysExpTime[k] > Date.now())
                    Result.set(k, cacheKeys[k])
                else
                    noCache.push(v.key)
            })

            if (noCache.length > 0) {
                const { data } = await getSystemParamsByKeys({ classKeyList: noCache })

                data.forEach((items) => {
                    const idx = RequestKeys.indexOf(items[0].classKey as KeysOf<T>)
                    if (idx === -1)
                        return

                    const MapKey = ColumnsKeys[idx] as KeysOf<T>
                    const Param = mapList.get(MapKey)
                    if (!Param)
                        return

                    const options = items.map((item) => {
                        const value = Param.value ? Param.value(item) : item.itemId
                        const label = Param.label ? Param.label(item) : item.itemValue
                        const disabled = Param.disabled ? Param.disabled(item) : false

                        return { value, label, disabled }
                    })
                    Result.set(MapKey, options)

                    cacheKeys[MapKey] = options
                    cacheKeysExpTime[MapKey] = Date.now() + ExpTime
                })
            }

            return Result
        }

        return { cacheKeys, cacheKeysExpTime, GetSystemParams }
    },
    {
        persist: true,
    },
)

interface SystemParamsItem {
    /** 查询的key */
    classKey: string
    /** value值 number */
    itemId: number
    /** value值 string */
    itemKey: string
    /** label值 */
    itemValue: string
    /** 值描述 */
    itemDesc: string
}

interface ReqSystemParams { classKeyList: string[] }
function getSystemParamsByKeys(data: ReqSystemParams) {
    return Http.CrudRequest<SystemParamsItem[][], ReqSystemParams>({ url: '/sysParam/getClasses', data })
}
