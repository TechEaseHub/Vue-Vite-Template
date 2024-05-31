import HttpClient from '@/utils/http'

export interface UserInfo {
    userId: number
    userName: string
    password: string
    salt: string
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
    operatorName: string
    deleteFlag: number
    createTime: string
    updateTime: string
}

export interface UserRequest {
    /** 用户名 */
    userName: string
    /** 密码 */
    password: string
    /** 验证码 */
    verifyCode?: string
    /** 记住密码 */
    remember?: boolean
}

export interface UserResult {
    userInfo: UserInfo
    roleIdList: number[]
    rights: string
    userId: number
    token: string
}

const Http = new HttpClient()

class User {
    /** 获取验证码 */
    getVerifyCode() {
        return Http.GET<Blob>('/login/getVerifyCode', { responseType: 'blob' })
    }

    /** 登录 */
    login(data: UserRequest) {
        return Http.POST<UserResult>('/login/login', data)
    }
}

export { User }
