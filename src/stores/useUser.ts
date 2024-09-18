import { MD5 } from 'crypto-js'
import { routes } from 'vue-router/auto-routes'
import type { RouteRecordRaw } from 'vue-router'

import { Http } from '@/utils/http'
import { router } from '@/router'

interface UserInfo {
    /** 用户ID */
    readonly userId: number
    /** 用户类型，1-系统管理员、2-公司内部用户、3-外部用户 */
    userType: number
    /** 用户名 */
    userName: string
    /** 用户密码 */
    password: string
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
interface Request {
    /** 用户名 */
    userName: string
    /** 密码 */
    password: string
    /** 验证码 */
    verifyCode?: string
    /** 记住密码 */
    remember?: boolean
}
interface Result {
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

/** 权限树节点类型 */
interface TreeNode {
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
interface PermissionsMap { [key: string]: string[] }

const TOKEN = import.meta.env.VITE_TOKEN_NAME

export const useUserStore = defineStore(
    'user',
    () => {
        // 验证码
        const verifyCodeSrc = ref<string>()
        const getVerifyCode = async (): Promise<void> => {
            try {
                const blob = await Http.request<Blob>({ url: '/login/getVerifyCode', method: 'GET', responseType: 'blob', timeout: 1000 * 2, retry: 3, retryDelay: 1000 })
                verifyCodeSrc.value = window.URL.createObjectURL(blob)
            }
            catch (error) {
                console.error('获取验证码失败', error)
            }
        }

        // 动态添加路由
        const isAddRoute = ref(false)
        const addRoute = () => {
            const routerStore = useRouterStore()
            const { sortRoutes } = storeToRefs(routerStore)

            if (isAddRoute.value) {
                router.addRoute({
                    path: '/',
                    component: () => import('@/layout/index.vue'),
                    children: sortRoutes.value,
                })
            }
        }

        const loginForm = reactive<Request>({
            userName: '',
            password: '',
            verifyCode: '',
            remember: false,
        })
        // 登录成功后赋值
        const userInfo = reactive<Partial<UserInfo>>({})
        const token = ref('')
        const rights = reactive({} as TreeNode)
        const permissions = ref<PermissionsMap>()

        const login = async (): Promise<Result> => {
            const data = { ...loginForm, password: MD5(loginForm.password).toString() }
            try {
                const Res = await Http.RetryPOST<Result, Request>('/login/login', data)

                token.value = Res.token
                Object.assign(userInfo, Res.userInfo)

                const rightsObj = JSON.parse(Res.rights)
                Object.assign(rights, rightsObj)

                if (Res.rights !== '{}')
                    permissions.value = generatePermissions(rightsObj)

                sessionStorage.setItem(TOKEN, Res.token)
                ElMessage.success('登录成功')

                router.push({ path: '/' })

                return Promise.resolve(Res)
            }
            catch (error) {
                console.error('登录失败：', error)
                return Promise.reject(error)
            }
        }

        const isLogin = computed(() => token.value !== '' && !!permissions.value)
        const ownRole = computed(() => permissions.value ? Object.keys(permissions.value) : [])

        const isAuth = (auths: string[] = []) => {
            // 如果没有传入任何权限要求，默认返回 true
            if (!auths.length)
                return true

            // 检查是否有匹配的权限
            return auths.some(auth => new Set(ownRole.value).has(auth))
        }

        const nestedRoutes = computed(() => sortRoutesByOrder(routes))

        function $reset() {}

        return {
            /** 存放登录信息的表单 */
            loginForm,
            /** 验证码图片地址 */
            verifyCodeSrc,
            /** 获取验证码 */
            getVerifyCode,
            /** 用户名/密码 登录 */
            login,

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
            /**
             * 是否授权
             * @param auths 需要的权限列表, 为空数组 return true, 表示不需要任何权限
             */
            isAuth,
            /** 拥有的角色 */
            ownRole,
            /** 是否添加了动态路由 */
            isAddRoute,
            /** 添加动态路由 */
            addRoute,

            /** 处理后的嵌套路由路由 */
            nestedRoutes,

            /** 自定义重置函数 */
            $reset,
        }
    },
    {
        persist: [
            {
                storage: sessionStorage,
                paths: ['userInfo', 'token', 'rights', 'permissions'],
            },
            {
                storage: localStorage,
                paths: ['loginForm.userName', 'loginForm.password', 'loginForm.remember'],
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

function sortRoutesByOrder(routes: RouteRecordRaw[]): RouteRecordRaw[] {
    const toSortedRoutes = routes.toSorted((a, b) => {
        // 使用可选链和空值合并运算符来安全地获取 order 值
        const orderA = a.meta?.order ?? 0
        const orderB = b.meta?.order ?? 0
        return orderA - orderB
    })

    // 递归地对每个子路由数组进行排序
    toSortedRoutes.forEach((route) => {
        if (route.children && Array.isArray(route.children))
            sortRoutesByOrder(route.children) // 直接修改子路由数组，因为我们已经传入了引用
    })

    return toSortedRoutes
}
