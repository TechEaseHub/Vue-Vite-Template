import { MD5 } from 'crypto-js'

import { Http } from '@/utils/http'

import type { UserInfo } from '@/views/user/hooks'

interface LoginRequest {
    /** 用户名 */
    userName: string
    /** 密码 */
    password: string
    /** 验证码 */
    verifyCode?: string
    /** 记住密码 */
    remember?: boolean
}

interface LoginResult {
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

/** 获取验证码 */
function getVerifyCode() {
    return Http.GET<Blob>('/login/getVerifyCode', { responseType: 'blob' })
}

const loginRequest: LoginRequest = reactive({
    userName: 'test',
    password: '12345678',
    verifyCode: '',
    remember: false,
})

/** 登录 */
function login(loginRequest: LoginRequest) {
    const data = { ...loginRequest, password: MD5(loginRequest.password).toString() }
    return Http.POST<LoginResult, LoginRequest>('/login/login', data)
}

export { getVerifyCode, loginRequest, login }
export type { LoginRequest, LoginResult }
