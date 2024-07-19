import { createCommonProps } from '@/views/example/custom/hooks'
import { type BaseRow, type ColumnsType, CommonProps, type Fields, type Props } from '@/components/A-Crud'
import { type KeysOf, type MapValueType, type ResultType, systemParamsStore } from '@/stores'

interface Row extends BaseRow {
    readonly userId: number
    userName: string
    password: string
    // salt: '2022-01-01 00:00:00'
    userType: number
    orgId: number
    orgName: string
    realName: string
    email: string
    phoneNumber: string
    sex: number
    birth: null
    idNo: string
    openId: string
    woaOpenid: string
    remark: string
    photoUrlRoot: string
    photoPath: string
}
const { operatorName, deleteFlag, createTime, updateTime } = CommonProps<Row>()
const { orgId } = createCommonProps<Row>()

const columns: ColumnsType<Row> = {
    userId: {
        type: markRaw(ElInput),
        label: 'userId',
    },
    userName: {
        type: markRaw(ElInput),
        label: 'userName',
    },
    password: {
        type: markRaw(ElInput),
        label: 'password',
    },
    userType: {
        type: markRaw(ElInput),
        label: 'userType',
    },
    orgId,
    orgName: {
        type: markRaw(ElInput),
        label: 'orgName',
    },
    realName: {
        type: markRaw(ElInput),
        label: 'realName',
    },
    email: {
        type: markRaw(ElInput),
        label: 'email',
    },
    phoneNumber: {
        type: markRaw(ElInput),
        label: 'phoneNumber',
    },
    sex: {
        type: markRaw(ElInput),
        label: 'sex',
    },
    birth: {
        type: markRaw(ElInput),
        label: 'birth',
    },
    idNo: {
        type: markRaw(ElInput),
        label: 'idNo',
    },
    openId: {
        type: markRaw(ElInput),
        label: 'openId',
    },
    woaOpenid: {
        type: markRaw(ElInput),
        label: 'woaOpenid',
    },
    remark: {
        type: markRaw(ElInput),
        label: 'remark',
    },
    photoUrlRoot: {
        type: markRaw(ElInput),
        label: 'photoUrlRoot',
    },
    photoPath: {
        type: markRaw(ElInput),
        label: 'photoPath',
    },
    operatorName,
    deleteFlag,
    createTime,
    updateTime,
}
// console.log(Object.keys(columns))

const fields: Fields<Row> = {
    filter: ['userId', 'userName', 'password', 'userType', 'orgId', 'orgName', 'realName', 'email', 'phoneNumber', 'sex', 'birth', 'idNo', 'openId', 'woaOpenid', 'remark', 'photoUrlRoot', 'photoPath', 'operatorName', 'deleteFlag', 'createTime', 'updateTime'],
    editor: ['userId', 'userName', 'password', 'userType', 'orgId', 'orgName', 'realName', 'email', 'phoneNumber', 'sex', 'birth', 'idNo', 'openId', 'woaOpenid', 'remark', 'photoUrlRoot', 'photoPath', 'operatorName', 'deleteFlag', 'createTime', 'updateTime'],
    column: ['userId', 'userName', 'password', 'userType', 'orgId', 'orgName', 'realName', 'email', 'phoneNumber', 'sex', 'birth', 'idNo', 'openId', 'woaOpenid', 'remark', 'photoUrlRoot', 'photoPath', 'operatorName', 'deleteFlag', 'createTime', 'updateTime'],
    expand: ['userId', 'userName', 'password', 'userType', 'orgId', 'orgName', 'realName', 'email', 'phoneNumber', 'sex', 'birth', 'idNo', 'openId', 'woaOpenid', 'remark', 'photoUrlRoot', 'photoPath', 'operatorName', 'deleteFlag', 'createTime', 'updateTime'],
}
const attributes: Props<Row> = {
    apiConfig: {
        url: '/user',
        rowKey: 'userId',
    },
    source: { fields, columns },
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
    console.log(from)
}

export { attributes, columns, searchFormChange }
