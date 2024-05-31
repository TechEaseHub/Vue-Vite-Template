import axios from 'axios'

import type { AxiosInstance, AxiosRequestConfig } from 'axios'

export class HttpClient {
    private instance: AxiosInstance

    constructor(baseURL = import.meta.env.VITE_BASE_API) {
        this.instance = this.createAxiosInstance(baseURL)

        this.httpInterceptorsRequest()
        this.httpInterceptorsResponse()
    }

    /** 创建 axios 实例 */
    private createAxiosInstance(baseURL: string) {
        return axios.create({
            baseURL,
            timeout: 1000 * 5,
            headers: { 'Content-Type': 'application/json' },
        })
    }

    /** 添加请求拦截器 */
    private httpInterceptorsRequest() {
        this.instance.interceptors.request.use(
            (config) => {
                // 请求头添加 Authorization token
                config.headers.Authorization = sessionStorage.getItem('token')

                return config
            },
            (error) => {
                return Promise.reject(error)
            },
        )
    }

    /** 添加响应拦截器 */
    private httpInterceptorsResponse() {
        this.instance.interceptors.response.use(
            (response) => {
                // 如果是下载文件，则直接返回 blob
                if (response.config.responseType === 'blob')
                    return response.data

                // 请求错误处理
                if (response.data.code !== 0) {
                    ElMessage.error(response.data.message)
                    return Promise.reject(response.data)
                }

                return response.data
            },
            (error) => {
                return Promise.reject(error)
            },
        )
    }

    // TODO：添加请求/响应错误处理

    /** Request 请求方法 */
    public Request<T = any>(config: AxiosRequestConfig): Promise<T> {
        return this.instance.request(config)
    }

    /** GET 请求方法 */
    public GET<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
        return this.instance.get(url, config)
    }

    /** POST 请求方法 */
    public POST<T = any>(url: string, data: any, config?: AxiosRequestConfig): Promise<T> {
        return this.instance.post(url, data, config)
    }
}

export default HttpClient
