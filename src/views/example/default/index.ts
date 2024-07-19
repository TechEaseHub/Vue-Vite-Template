import { columns, fields } from './hooks'
import type { Row } from './hooks'

import type { Props } from '@/components/A-Crud'

import { systemParamsStore } from '@/stores/systemParams'
import type { KeysOf, MapValueType, ResultType } from '@/stores/systemParams'

const attribute: Props<Row> = {
    apiConfig: {
        url: 'user',
        rowKey: 'userId',
    },
    source: { fields, columns },
    hooks: {
        beforeQueryHandler: ({ searchForm, formData }) => {
            // 处理多选
            if (Array.isArray(searchForm.hobby))
                formData.value.hobby = searchForm.hobby.join(',')
            if (Array.isArray(searchForm.hobby2))
                formData.value.hobby2 = searchForm.hobby2.join(',')

            return true
        },
    },
}

// TODO: 虽然键是一样的，但是获取数据时处理 value、label、disabled 等属性的方式可能不一样
// TODO：在缓存与取缓存时，需要根据当前键值对应的处理方式来处理
const ParamsMap = new Map<KeysOf<Row>, MapValueType>([
    ['deleteFlag', { key: 'delete_flag' }],
    // 如：disabled处理方式，在这里所有都可用，但是在其他地方可能是值为1时禁用
    ['sex', { key: 'sex', value: item => item.itemId, label: item => item.itemValue, disabled: () => false }],
])
const Params: Partial<Record<KeysOf<Row>, ResultType[]>> = reactive({})

systemParamsStore().GetSystemParams(ParamsMap).then((Res) => {
    Res.forEach((value, key) => {
        Params[key] = value
        if (columns[key]?.componentProps && columns[key].componentProps?.options)
            columns[key].componentProps.options = value
        else
            console.warn(`columns 中 ${key} 未找到 componentProps.options 配置`)
    })
})

function searchFormChange(from: Row) {
    const unWatch = watch(() => from.name, (name, prevname) => {
        console.log(name, prevname)
        unWatch()
    })
}

export { attribute, columns, searchFormChange }
