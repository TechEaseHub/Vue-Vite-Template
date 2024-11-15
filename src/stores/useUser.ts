export interface UserInfo {
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

/** 权限树节点类型 */
export interface TreeNode {
  isIncluded: number
  nodeData: {
    funcId: number
    funcName: string
    parentId: number
    level: number
    orderNo: number
    url?: string
    domKey: string
    imgTag?: string
  }
  children?: TreeNode[]
}

/** 处理后的权限呢映射表 */
export interface PermissionsMap { [key: string]: string[] }

export const useUserStore = defineStore(
  'user',
  () => {
  // 登录成功后赋值
    const userInfo = ref<UserInfo>()
    const token = ref<string>()
    const rights = ref<TreeNode>()
    const permissions = ref<PermissionsMap>()

    // 简化计算逻辑，移除不必要的判断条件
    const isLogin = computed(() => !!token.value && !!permissions.value && !!userInfo.value)
    const ownRole = computed(() => permissions.value ? Object.keys(permissions.value) : [])

    function $reset() {
      userInfo.value = undefined
      token.value = undefined
      rights.value = undefined
      permissions.value = undefined
    }

    return {
    /** 登录后返回的用户信息 */
      userInfo,
      /** 授权 Token */
      token,
      /** 权限树原始对象 */
      rights,
      /** 权限树处理后的 权限对象 */
      permissions,

      /** 是否已登录 */
      isLogin,
      /** 拥有的角色 */
      ownRole,

      /** 自定义重置函数 */
      $reset,
    }
  },
  {
    persist: [
      {
        storage: sessionStorage,
        pick: ['userInfo', 'token', 'rights', 'permissions'],
      },
    ],
  },
)
