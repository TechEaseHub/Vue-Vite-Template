import { Http } from '@/utils/http'

interface OrgnizationInfo {
    /** ID */
    orgId: number
    /** 编号 */
    orgCode: ''
    /** 名称 */
    orgName: string
    /** 全称 */
    orgFullname: string
    /** 类型    1-本公司，2-政府管理部门，3-学院 */
    orgType: 4
    /** 分类 */
    orgCategory: 0
    /** 负责人 */
    leader: ''
    /** 联系人 */
    contacts: string
    /** 联系电话 */
    phoneNumber: string
    /** 邮箱 */
    email: string
    /** 地址 */
    address: string
    /** 邮编 */
    zipcode: string
    /** 行政区  行政区省、市、区县名称 */
    district: '闵行区'
    /** 行政区级别  1-国家级、2-副国级、3-省部级、4、副省级、5-市级、6、副市级、7-区县、8-副县级、9-街道乡镇级 */
    districtLevel: 5
    /** 经度 */
    lon: string | null
    /** 纬度 */
    lat: string | null
    /** 备注 */
    remark: string
    /** 操作人账号 */
    operatorName: string
    /** 记录删除标记，0-正常，1-已删除 */
    deleteFlag: 0 | 1
    /** 创建时间 */
    createTime: string
    /** 最后更新时间 */
    updateTime: string
    /** 父组织ID */
    parentId: number
    /** 父组织名称 */
    parentOrgName: string
    /** 关联平台 */
    appId: number
    /** 节点ID */
    nodeId: number
    /** 节点名称 */
    nodeName: string
}

type SelectKeys = 'orgId' | 'orgName' | 'orgType' | 'contacts' | 'phoneNumber' | 'deleteFlag'

function query(data: Pick<OrgnizationInfo, SelectKeys>): Promise<OrgnizationInfo[]> {
    return Http.POST('organization/query', data)
}

export { query }
export type { OrgnizationInfo }
