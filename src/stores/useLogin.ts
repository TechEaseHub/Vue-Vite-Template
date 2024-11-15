import type { PermissionsMap, TreeNode, UserInfo } from './useUser'
import { MD5 } from 'crypto-js'

export interface Request {
  /** 用户名 */
  userName: string
  /** 密码 */
  password: string
  /** 验证码 */
  verifyCode?: string
  /** 记住密码 */
  remember?: boolean
}

export interface Result {
  /** 登录的用户信息 */
  userInfo: UserInfo
  /** 拥有的角色列表 */
  roleIdList: number[]
  /** 权限树字符串 */
  rights: string
  userId: number
  /** 鉴权 token */
  token: string
}

const TOKEN = import.meta.env.VITE_TOKEN_NAME

export const useLoginStore = defineStore(
  'login',
  () => {
    const route = useRoute()
    const router = useRouter()

    const userStore = useUserStore()
    const routerStore = useRouterStore()

    /** 验证码图片地址 */
    const verifyCodeSrc = ref<string>()
    /** 获取验证码 */
    const getVerifyCode = async (): Promise<void> => {
      try {
        const blob = await Http.request<Blob>({
          url: '/login/getVerifyCode',
          method: 'GET',
          responseType: 'blob',
          timeout: 1000 * 2,
          retry: 3,
          retryDelay: 1000,
        })

        // 如果存在之前的对象 URL，则先释放它
        if (verifyCodeSrc.value)
          URL.revokeObjectURL(verifyCodeSrc.value)

        verifyCodeSrc.value = URL.createObjectURL(blob)
      }
      catch (error) {
        console.error('获取验证码失败', error)
      }
    }

    const loginForm = reactive<Request>({
      userName: 'test',
      password: '12345678',
      verifyCode: '',
      remember: false,
    })

    const login = async (): Promise<void> => {
      try {
        const data = await Http.RetryPOST<Result, Request>('/login/login', {
          ...loginForm,
          password: MD5(loginForm.password).toString(),
        })

        // 检查是否成功获取 token 和 userInfo
        if (!data || !data.token || !data.userInfo || !data.rights) {
          console.error('登录信息无效')
          throw new Error('登录信息无效')
        }

        // 保存 Token
        userStore.token = data.token
        sessionStorage.setItem(TOKEN, data.token)

        // 保存 userInfo
        userStore.userInfo = data.userInfo

        // 保存 权限
        let rightsObj
        try {
          rightsObj = JSON.parse(data.rights)
        }
        catch (error) {
          console.error('解析权限数据失败', error)
          throw new Error('权限数据无效')
        }
        userStore.rights = rightsObj || {}
        userStore.permissions = generatePermissions(rightsObj || {})

        ElMessage.success('登录成功')

        // 重定向路由
        const redirectPath = route.query.redirect ? String(route.query.redirect) : '/'
        router.replace(redirectPath)
      }
      catch (error) {
        ElMessage.error('登录失败，请检查您的账号和密码')
        console.error('登录失败', error)
      }
    }

    const simulateLogin = async (): Promise<void> => {
    // 按照自己的接口要求  模拟登录
    // 模拟网络请求延迟和成功响应
      const data = await new Promise<{ token: string, userInfo: any, rights: string }>((resolve) => {
        setTimeout(() => {
        // 模拟返回的成功数据
          resolve({
            token: 'mocked_token_12345',
            userInfo: {
              id: 1,
              name: 'John Doe',
              email: 'john.doe@example.com',
            },
            rights: JSON.stringify({
              viewDashboard: true,
              editSettings: false,
              manageUsers: true,
            }),
          })
        }, 1000) // 模拟 1 秒延迟
      })

      // 检查是否成功获取 token 和 userInfo
      if (!data || !data.token || !data.userInfo || !data.rights) {
        console.error('登录信息无效')
        throw new Error('登录信息无效')
      }

      // 保存 Token
      userStore.token = data.token
      sessionStorage.setItem(TOKEN, data.token)

      // 保存 userInfo
      userStore.userInfo = data.userInfo

      userStore.rights = {} as any
      userStore.permissions = {}

      ElMessage.success('登录成功')

      // 重定向路由
      const redirectPath = route.query.redirect ? String(route.query.redirect) : '/'
      router.replace(redirectPath)
    }

    const logout = () => {
      console.log('logout  退出登录')
      userStore.$reset()
      routerStore.$reset()

      router.replace('/login')
    }

    return {
      verifyCodeSrc,
      getVerifyCode,

      loginForm,
      login,
      logout,

      simulateLogin,
    }
  },
  {
    persist: [
      {
        storage: localStorage,
        pick: ['loginForm.userName', 'loginForm.password', 'loginForm.remember'],
        serializer: {
          serialize: (state) => {
            if (!state.loginForm.remember)
              delete state.loginForm

            return JSON.stringify(state)
          },
          deserialize: state => JSON.parse(state),
        },
      },
    ],
  },
)

/**
 * 权限树处理成对象的方法
 * @param node 权限树节点
 * @returns 权限Map对象
 */
function generatePermissions(node: TreeNode): PermissionsMap {
  const result: PermissionsMap = {}

  function traverse(node: TreeNode): void {
    const { domKey } = node.nodeData

    if (node.children && node.children.length > 0) {
      // 获取子节点的 domKey 列表
      const childKeys = node.children.map(child => child.nodeData.domKey)
      // 如果当前节点有 domKey，则记录下来
      if (domKey)
        result[domKey] = childKeys

      // 递归处理子节点
      node.children.forEach(traverse)
    }
  }

  traverse(node)

  return result
}
