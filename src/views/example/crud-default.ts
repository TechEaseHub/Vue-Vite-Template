import type { KeysOf, MapValueType, ResultType } from '@/stores/useSystemParams'
import type { CancelTokenSource } from '@/utils/http'
import { type BaseRow, type ColumnsItemType, type ColumnsType, CommonProps, type Fields, ReRadioGroup, ReSelect } from '@/components/EasyCrud'

export interface UserInfo extends BaseRow {
  /** 用户ID */
  userId: number
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
  orgName: string

  /** 微信小程序的openid */
  openId: string
  /** 微信公众号openid */
  woaOpenid: string

  /** url根部信息，如：https://abc.com/ */
  readonly photoUrlRoot: string
  /** 图片存储路径，如：/images/abc/xxx.jpg */
  readonly photoPath: string
}

/** 创建通用 definitions 属性 */
function createCommonProps<T extends Partial<Pick<UserInfo, 'userId' | 'userName' | 'realName' | 'phoneNumber' | 'sex' | 'idNo'>>>() {
  const userId: ColumnsItemType<T, 'userId'> = reactive({
    type: markRaw(ReSelect),
    label: '用户ID',
    componentProps: {
      options: [],
      placeholder: '用户名称查找',
      filterable: true,
      remote: true,
      onRemoteMethod: (query: string, cancelToken: Ref<CancelTokenSource | undefined>, closeLoading: () => void) => {
        const componentProps = userId.componentProps!

        Http.EasyCrudRequest<{ userId: number, userName: string, realName: string, phoneNumber: string }[]>({
          url: '/user/query',
          method: 'POST',
          data: { userName: query, deleteFlag: 0 },
          cancelToken: cancelToken.value?.token,
          timeout: 1000 * 5,
        }).then((Res) => {
          componentProps.options = Res.data.map((item) => {
            return { value: item.userId, label: `${item.userName}【${item.realName}】`, disabled: false }
          })
        }).finally(closeLoading)
      },
    },
    tableProps: { width: 100, align: 'right' },
  })
  const userName: ColumnsItemType<T, 'userName'> = reactive({
    type: markRaw(ElInput),
    label: '用户名',
    tableProps: { width: 120 },
  })
  const realName: ColumnsItemType<T, 'realName'> = reactive({
    type: markRaw(ElInput),
    label: '真实姓名',
    tableProps: { width: 120 },
  })

  const phoneNumber: ColumnsItemType<T, 'phoneNumber'> = reactive({
    type: markRaw(ElInput),
    label: '手机号码',
    componentProps: {
      maxlength: 11,
      showWordLimit: true,
    },
    formProps: { edit: { rules: [{ required: true, message: '请输入手机号码', trigger: 'blur' }] } },
    tableProps: { width: 120 },
  })
  const sex: ColumnsItemType<T, 'sex'> = reactive({
    type: markRaw(ReRadioGroup),
    label: '性别',
    componentProps: { options: [], isButton: true },
  })
  const idNo: ColumnsItemType<T, 'idNo'> = reactive({
    type: markRaw(ElInput),
    label: '身份证号码',
  })

  return { userId, userName, realName, phoneNumber, sex, idNo }
}

const { operatorName, deleteFlag, createTime, updateTime } = CommonProps<UserInfo>()
const { userId, userName, realName, phoneNumber, sex, idNo } = createCommonProps<UserInfo>()
// const { orgId, orgName } = SchoolProps<UserInfo>()

export const definitions: ColumnsType<UserInfo> = reactive({
  userId,
  userType: {
    type: markRaw(ReRadioGroup),
    label: '用户类型',
    span: 18,
    formProps: { edit: { rules: [{ required: true, message: '请选择用户类型', trigger: 'change' }] } },
    componentProps: { options: [], isButton: true },
  },
  userName: {
    ...userName,
    formProps: { edit: { rules: [{ required: true, message: '请输入登录用户名', trigger: 'blur' }] } },
    componentProps: { placeholder: '登录用户名' },
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
  realName,
  email: {
    type: markRaw(ElInput),
    label: 'Email',
  },
  phoneNumber,
  sex,
  birth: {
    type: markRaw(ElInput),
    label: '生日',
  },
  idNo,
  remark: {
    type: markRaw(ElInput),
    label: '备注',
  },

  orgId: {
    // ...orgId,
    type: markRaw(ElInput),
    label: 'orgId',
    formProps: { edit: { rules: [{ required: true, message: '请选择所属机构', trigger: 'blur' }] } },
  },
  orgName: {
    type: markRaw(ElInput),
    label: 'orgName',
  },

  openId: {
    type: markRaw(ElInput),
    label: 'openid[小程序]',
    tableProps: { minWidth: 150 },
  },
  woaOpenid: {
    type: markRaw(ElInput),
    label: 'openid[公众号]',
    tableProps: { minWidth: 150 },
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

export const fields: Fields<UserInfo> = {
  filter: ['orgId', 'userName', 'realName', 'phoneNumber', 'userType', 'deleteFlag'],
  editor: ['orgId', 'userType', 'userName', 'password', 'realName', 'phoneNumber', 'email', 'openId', 'woaOpenid', 'remark'],
  column: ['orgName', 'userName', 'realName', 'phoneNumber', 'openId', 'woaOpenid', 'deleteFlag'],
  expand: ['orgId', 'orgName', 'userId', 'userName', 'userType', 'realName', 'phoneNumber', 'openId', 'woaOpenid', 'remark', 'operatorName', 'deleteFlag', 'createTime', 'updateTime'],
}

const Params: Partial<Record<KeysOf<UserInfo>, ResultType[]>> = reactive({})

useSystemParamsStore().GetSystemParams(
  new Map<KeysOf<UserInfo>, MapValueType>([
    ['deleteFlag', { key: 'delete_flag' }],
    ['userType', { key: 'user_type', disabled: item => item.itemId === 1 }],
    ['sex', { key: 'sex', value: item => item.itemId, label: item => item.itemValue }],
  ]),
).then((Res) => {
  Res.forEach((value, key) => {
    Params[key] = value

    const defKey = definitions[key]
    if (defKey && defKey.componentProps && defKey.componentProps.options)
      defKey.componentProps.options = value.filter(item => !item.disabled)
    else
      console.warn(`definitions 中 ${key} 未找到 componentProps.options 配置`)
  })
})
