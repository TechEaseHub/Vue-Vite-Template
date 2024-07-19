import axios, { isCancel } from 'axios'
import type { AxiosError, AxiosInstance, AxiosRequestConfig, CancelTokenSource, InternalAxiosRequestConfig, ResponseData } from 'axios'

declare module 'axios' {
    interface InternalAxiosRequestConfig {
        /** 原始baseURL */
        _originalBaseURL?: string
        /** 原始URL */
        _originalUrl?: string
    }

    interface AxiosRequestConfig {
        /**
         * 重试次数
         * @default 3
         */
        retry?: number
        /**
         * 重试间隔
         * @default 1000
         */
        retryDelay?: number
    }

    interface ResponseData<T = any> {
        code: number
        message: string
        data: T
        page: {
            /** 当前页 */
            pageNum: number
            /** 分页大小 */
            pageSize: number
            /** 总条数 */
            total: number
        } | null
    }
}

// HTTP 客户端类
class HttpClient {
    private instance: AxiosInstance
    private cancelTokenSourceMap: Map<string, CancelTokenSource>

    constructor(options: AxiosRequestConfig = { baseURL: import.meta.env.VITE_BASE_API }) {
        this.instance = this.createAxiosInstance(options)
        this.cancelTokenSourceMap = new Map<string, CancelTokenSource>()

        this.httpInterceptorsRequest()
        this.httpInterceptorsResponse()
    }

    /** 创建 axios 实例 */
    private createAxiosInstance(options: AxiosRequestConfig) {
        return axios.create({
            timeout: 1000 * 2, // 请求超时时间设置为 2 秒
            headers: { 'Content-Type': 'application/json' }, // 设置请求头为 JSON 格式
            ...options,
        })
    }

    /** 添加请求拦截器 */
    private httpInterceptorsRequest() {
        this.instance.interceptors.request.use(
            (config) => {
                // console.log('【发起请求、成功】拦截器', this.cancelTokenSourceMap, config)

                // 保存原始的 url 和 baseURL
                config._originalBaseURL = config.baseURL
                config._originalUrl = config.url

                // 添加请求取消功能
                this.handleCancelToken(config)

                // 请求头添加 Authorization token
                config.headers.Authorization = sessionStorage.getItem('Authorization')

                return config
            },
            (error) => {
                // console.log('【发起请求、失败】拦截器\n', error)

                return Promise.reject(error)
            },
        )
    }

    /** 添加响应拦截器 */
    private httpInterceptorsResponse() {
        this.instance.interceptors.response.use(
            (response) => {
                // console.log('【响应成功】拦截器\n', response)
                this.removeCancelToken(response.config)

                // 如果接口响应类型是 blob， 直接返回
                if (response.config.responseType === 'blob')
                    return response.data

                // 处理接口返回的错误消息
                if (response.data.code !== 0) {
                    ElMessage.error(response.data.message)
                    return Promise.reject(response.data)
                }

                return response.data
            },
            (error) => {
                // console.log('【响应失败】拦截器\n', error)

                if (error.config)
                    this.removeCancelToken(error.config)

                // 请求超时处理
                if (error.code === 'ECONNABORTED' && error.message.includes('timeout'))
                    return this.handleTimeoutError(error, this.Request.bind(this))

                console.log('其他请求错误处理', error)
                if (error.response?.status === 401) {
                    // 处理授权错误，例如跳转到登录页
                }

                ElNotification({
                    type: 'error',
                    title: error.name,
                    message: error.message,
                })
                return Promise.reject(error)
            },
        )
    }

    /** 请求令牌的生成和处理取消请求 */
    private handleCancelToken(config: InternalAxiosRequestConfig): void {
        const requestKey = `${config.method}:${config.url}`
        // 取消上一个请求
        if (this.cancelTokenSourceMap.has(requestKey))
            this.cancelTokenSourceMap.get(requestKey)?.cancel('取消请求')

        // 如果已经有传递的取消令牌，将其保存到 map 中
        if (config.cancelToken) {
            this.cancelTokenSourceMap.set(requestKey, { token: config.cancelToken, cancel: () => {} } as CancelTokenSource)
        }
        else {
            // 创建新的取消令牌
            const cancelTokenSource = axios.CancelToken.source()
            config.cancelToken = cancelTokenSource.token
            this.cancelTokenSourceMap.set(requestKey, cancelTokenSource)
        }
    }

    /** 移除取消令牌 */
    private removeCancelToken(config: InternalAxiosRequestConfig): void {
        const requestKey = `${config.method}:${config._originalUrl}`
        this.cancelTokenSourceMap.delete(requestKey)
    }

    /** 响应超时错误处理 */
    private async handleTimeoutError(error: AxiosError, retryRequest: (config: AxiosRequestConfig) => Promise<ResponseData<any>>) {
        const config = error.config

        if (!config)
            return Promise.reject(error)

        const { _originalBaseURL, _originalUrl, retry, ...restConfig } = config

        if (retry && retry > 0) {
            // 添加一个请求间隔时间
            const timeFlag = new Promise((resolve) => {
                setTimeout(() => {
                    resolve(true)
                }, config?.retryDelay || 1000)
            })

            const flag = await timeFlag

            if (flag) {
                // 从 config 中提取 baseURL 和 url
                return retryRequest({
                    ...restConfig,
                    baseURL: _originalBaseURL,
                    url: _originalUrl,
                    retry: retry - 1,
                })
            }
        }

        ElNotification({
            type: 'error',
            title: error.name,
            message: error.message,
        })
        return Promise.reject(error)
    }

    /** Request 请求方法 */
    public Request<Res = any, Req = any>(config: AxiosRequestConfig<Req>): Promise<ResponseData<Res>> {
        return this.instance.request<any, ResponseData<Res>, Req>(config)
    }

    /** GET 请求方法 */
    public GET<Res = any, Req = any>(url: string, config?: AxiosRequestConfig<Req>): Promise<Res> {
        return this.instance.get<any, Res, Req>(url, config)
    }

    /** POST 请求方法，响应为原始响应的 data 属性 */
    public async POST<Res = any, Req = any>(url: string, data: Req, config?: AxiosRequestConfig<Req>): Promise<Res> {
        return (await this.instance.post<any, ResponseData<Res>, Req>(url, data, config)).data
    }

    /** CRUD 组件使用的请求方法，自带了 retry: 3 和 retryDelay: 1000，响应为原始响应 */
    public CrudRequest<Res = any, Req = any>(config: AxiosRequestConfig<Req>): Promise<ResponseData<Res>> {
        return this.instance.request<Res, ResponseData<Res>, Req>({ method: 'POST', retry: 3, retryDelay: 1000, ...config })
    }
}

// 创建 HttpClient 实例
const Http = new HttpClient()

export { HttpClient as default, Http, isCancel }
export type { ResponseData }
