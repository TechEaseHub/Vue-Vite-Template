import type { BaseRow } from '@/components/A-Crud'

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

export type { UserInfo }
