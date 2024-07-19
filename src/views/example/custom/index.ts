import { type Row, createCommonProps } from './hooks'
import { CommonProps, InitCrudOptions, ReSelect } from '@/components/A-Crud/'
import type { ColumnsType, Fields, Props } from '@/components/A-Crud/'

import type { KeysOf, MapValueType, ResultType } from '@/stores/systemParams'

import { Http } from '@/utils/http'

const { operatorName, deleteFlag, createTime, updateTime } = CommonProps<Row>()
const { orgId } = createCommonProps<Row>()

const columns: ColumnsType<Row> = reactive({
    index: {
        type: markRaw({}),
        label: '序号',
        tableProps: { type: 'index', width: '55', align: 'right' },
        render: ({ $index, crudOptions }) => {
            const { TableStore: { page: { currentPage, pageSize } } } = crudOptions
            const indexMethod = computed(() => (currentPage.value - 1) * pageSize.value + 1)
            return h('span', null, indexMethod.value + $index)
        },
    },
    userId: {
        type: markRaw({}),
        label: '用户ID',
        tableProps: { width: 70, align: 'right' },
    },
    userName: {
        type: markRaw(ElInput),
        label: '用户名',
        tableProps: { width: 120 },
    },
    password: {
        type: markRaw(ElInput),
        label: '用户密码',
        visible: Mode => Mode === '新增',
    },
    userType: {
        type: markRaw(ReSelect),
        label: '用户类型',
        componentProps: { options: [], isButton: true },
    },
    orgId,
    orgName: {
        type: markRaw(ElInput),
        label: '组织名称',
    },
    realName: {
        type: markRaw(ElInput),
        label: '真实姓名',
    },
    email: {
        type: markRaw(ElInput),
        label: 'Email',
    },
    phoneNumber: {
        type: markRaw(ElInput),
        label: '手机号码',
        tableProps: { minWidth: 120 },
    },
    sex: {
        type: markRaw(ReSelect),
        label: '性别',
        componentProps: { options: [] },
    },
    birth: {
        type: markRaw(ElInput),
        label: '生日',
    },
    idNo: {
        type: markRaw(ElInput),
        label: '身份证号码',
    },
    openId: {
        type: markRaw(ElInput),
        label: '小程序的openid',
    },
    woaOpenid: {
        type: markRaw(ElInput),
        label: '公众号openid',
    },
    remark: {
        type: markRaw(ElInput),
        label: '备注',
    },
    photoUrlRoot: {
        type: markRaw(ElInput),
        label: 'url根',
    },
    photoPath: {
        type: markRaw(ElInput),
        label: '图片路径',
    },
    operatorName,
    deleteFlag,
    createTime,
    updateTime,
})

const fields: Fields<Row> = {
    filter: ['orgId', 'userName', 'realName', 'deleteFlag'],
    editor: ['orgId', 'userType', 'userName', 'password', 'realName', 'phoneNumber', 'email', 'openId', 'woaOpenid', 'remark'],
    expand: ['orgId', 'orgName', 'userId', 'userName', 'userType', 'realName', 'phoneNumber', 'openId', 'woaOpenid', 'operatorName', 'createTime', 'updateTime', 'remark', 'deleteFlag'],
    column: ['orgName', 'userName', 'realName', 'phoneNumber', 'deleteFlag'],
}

const attributes: Props<Row> = {
    apiConfig: {
        url: '/user',
        rowKey: 'userId',
        actionsName: {
            deleteFlag: 'delete',
        },
    },
    source: { fields, columns },
    hooks: {
        beforeEditHandler: ({ currentRow }) => {
            const orgIdProps = columns.orgId?.componentProps
            if (orgIdProps) {
                const { orgId: value, orgName: label } = currentRow.value
                orgIdProps.options = [{ value, label }]
            }
            return true
        },
    },
}

const crudOptions = InitCrudOptions<Row>(attributes.source, attributes.apiConfig, attributes.hooks)

const ParamsMap = new Map<KeysOf<Row>, MapValueType>([
    ['deleteFlag', { key: 'delete_flag' }],
    ['userType', { key: 'user_type', disabled: item => item.itemId === 1 }],
    ['sex', { key: 'sex', value: item => item.itemId, label: item => item.itemValue, disabled: item => item.itemId === 1 }],
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

const { FormStore: { searchForm } } = crudOptions

watch(() => searchForm.orgId, (orgId) => {
    console.log(orgId)

    Http.CrudRequest({
        url: 'teachingPlan/getItems',
        data: { orgId, deleteFlag: 0 },
    }).then((Res) => {
        console.log(Res)
    })
}, { deep: true })

export { attributes, crudOptions }
