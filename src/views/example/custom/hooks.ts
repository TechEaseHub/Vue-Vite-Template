import type { CancelTokenSource } from 'axios'
import { type BaseRow, type ColumnsItemType, ReSelect } from '@/components/A-Crud'
import { Http } from '@/utils/http'

interface Row extends BaseRow {
    /** 用户ID */
    userId: number
    /** 用户名 */
    userName: string
    /** 用户密码 */
    password: string
    /** 加盐md5算法中的盐 */
    // salt: '2022-01-01 00:00:00'
    /** 用户类型，1-系统管理员、2-公司内部用户、3-外部用户 */
    userType: number
    /** 组织机构ID */
    orgId: number
    /** 组织名称 */
    orgName: string
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
    /** 微信小程序的openid */
    openId: string
    /** 微信公众号openid */
    woaOpenid: string
    /** 备注 */
    remark: string
    /** url根部信息，如：https://abc.com/ */
    photoUrlRoot: string
    /** 图片存储路径，如：/images/abc/xxx.jpg */
    photoPath: string
    /** 操作人账号 */
    // operatorName: string
    /** 记录删除标记，0-正常、1-禁用 */
    // deleteFlag: 0
    /** 创建时间 */
    // createTime: string
    /** 更新时间 */
    // updateTime: string
}

function createCommonProps<T extends BaseRow>() {
    const orgId: ColumnsItemType<T> = reactive({
        type: markRaw(ReSelect),
        label: '组织机构ID',
        formProps: {
            edit: {
                rules: [{ required: true }],
            },
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

export type{ Row }
export { createCommonProps }
