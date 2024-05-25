/// <reference types="vite/client" />
/** 环境变量类型 */
interface ImportMetaEnv {
    /** 命名空间 */
    readonly VITE_NAMESPACE: string
    /** 接口请求地址前缀 */
    readonly VITE_BASE_API: string
    /** 代理地址 */
    readonly VITE_PROXY_URL: string
}
