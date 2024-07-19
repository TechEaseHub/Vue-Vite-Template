import type { CancelTokenSource } from 'axios'
import { Http } from '@/utils/http'

import { CommonProps, ReRadioGroup, ReSelect } from '@/components/A-Crud'
import type { BaseRow, ColumnsItemType, ColumnsType, Fields } from '@/components/A-Crud'

import { systemParamsStore } from '@/stores/systemParams'
import type { KeysOf, MapValueType, ResultType } from '@/stores/systemParams'

interface UserInfo extends BaseRow {
    /** 用户ID */
    readonly userId: number
    /** 用户类型，1-系统管理员、2-公司内部用户、3-外部用户 */
    userType: number
    /** 用户名 */
    userName: string
    /** 用户密码 */
    password: string
    /** 加盐md5算法中的盐 */
    // salt: '2022-01-01 00:00:00'
    /** 真实姓名 */
    realName: string
    /** Email */
    email: string
    /** 手机号码 */
    phoneNumber: string
    /** 性别，1-无值、2-男、3-女、4-其它 */
    sex: number
    /** 生日 */
    birth: string | null
    /** 身份证号码 */
    idNo: string
    /** 备注 */
    remark: string

    /** 组织机构ID */
    orgId: number
    /** 组织名称 */
    readonly orgName: string

    /** 微信小程序的openid */
    openId: string
    /** 微信公众号openid */
    woaOpenid: string

    /** url根部信息，如：https://abc.com/ */
    readonly photoUrlRoot: string
    /** 图片存储路径，如：/images/abc/xxx.jpg */
    readonly photoPath: string

    /** 操作人账号 */
    readonly operatorName: string
    /** 记录删除标记，0-正常、1-禁用 */
    deleteFlag: 0
    /** 创建时间 */
    readonly createTime: string
    /** 更新时间 */
    readonly updateTime: string
}

/** 创建通用 columns 属性 */
function createCommonProps<T extends BaseRow>() {
    const orgId: ColumnsItemType<T> = reactive({
        type: markRaw(ReSelect),
        label: '组织机构ID',
        formProps: {
            edit: { required: true },
        },
        componentProps: {
            options: [],
            placeholder: '机构名称查找',
            filterable: true,
            remote: true,
            onRemoteMethod: (query: string, cancelToken: Ref<CancelTokenSource | undefined>, closeLoading: () => void) => {
                const componentProps = orgId.componentProps!

                Http.CrudRequest<{ orgName: string, orgId: number }[]>({
                    url: '/orgnization/query',
                    method: 'POST',
                    data: { orgName: query, deleteFlag: 0 },
                    cancelToken: cancelToken.value?.token,
                    timeout: 1000 * 5,
                }).then((Res) => {
                    componentProps.options = Res.data.map((item) => {
                        return { label: item.orgName, value: item.orgId, disabled: false }
                    })
                }).finally(closeLoading)
            },
        },
    })
    return { orgId }
}

const { operatorName, deleteFlag, createTime, updateTime } = CommonProps<UserInfo>()
const { orgId } = createCommonProps<UserInfo>()

const columns: ColumnsType<UserInfo> = reactive({
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
        formProps: {
            edit: { required: true },
        },
        tableProps: { width: 120 },
    },
    password: {
        type: markRaw(ElInput),
        label: '用户密码',
        visible: Mode => Mode === '新增',
        formProps: {
            edit: {
                rules: [
                    { required: true, message: '请输入用户登录密码', trigger: 'blur' },
                    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' },
                ],
            },
        },
        componentProps: { showPassword: true },
    },
    userType: {
        type: markRaw(ReRadioGroup),
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

const fields: Fields<UserInfo> = {
    filter: ['orgId', 'userName', 'realName', 'deleteFlag'],
    editor: ['orgId', 'userType', 'userName', 'password', 'realName', 'phoneNumber', 'email', 'openId', 'woaOpenid', 'remark'],
    expand: ['orgId', 'orgName', 'userId', 'userName', 'userType', 'realName', 'phoneNumber', 'openId', 'woaOpenid', 'operatorName', 'createTime', 'updateTime', 'remark', 'deleteFlag'],
    column: ['orgName', 'userName', 'realName', 'phoneNumber', 'deleteFlag'],
}

const ParamsMap = new Map<KeysOf<UserInfo>, MapValueType>([
    ['deleteFlag', { key: 'delete_flag' }],
    ['userType', { key: 'user_type', disabled: item => item.itemId === 1 }],
    ['sex', { key: 'sex', value: item => item.itemId, label: item => item.itemValue, disabled: item => item.itemId === 1 }],
])
const Params: Partial<Record<KeysOf<UserInfo>, ResultType[]>> = reactive({})

systemParamsStore().GetSystemParams(ParamsMap).then((Res) => {
    Res.forEach((value, key) => {
        Params[key] = value
        if (columns[key]?.componentProps && columns[key].componentProps?.options)
            columns[key].componentProps.options = value
        else
            console.warn(`columns 中 ${key} 未找到 componentProps.options 配置`)
    })
})

export { createCommonProps, columns, fields, Params }
export type { UserInfo }
