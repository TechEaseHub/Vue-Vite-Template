import type { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, CancelTokenSource, InternalAxiosRequestConfig, ResponseData } from 'axios'
import axios, { isCancel } from 'axios'

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
    /**
     * 是否需要取消请求
     * @default true
     */
    isCancelToken?: boolean
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

const BASE_API = import.meta.env.VITE_BASE_API
const TOKEN_NAME = import.meta.env.VITE_TOKEN_NAME
const TIME_OUT = 1000 * 5
const RETRY = 3
const RETRY_DELAY = 1000

// HTTP 客户端类
class HttpClient {
  /** axios 实例 */
  private instance: AxiosInstance
  /** 请求取消 Token 映射表 */
  private cancelTokenSourceMap: Map<string, CancelTokenSource>

  /** 控制加载进度条 */
  private timer: number | undefined
  /** 控制加载进度条--当前请求数量 */
  private requestCount: number = 0

  constructor(options: AxiosRequestConfig = {}) {
    this.instance = this.createAxiosInstance(options)
    this.cancelTokenSourceMap = new Map<string, CancelTokenSource>()

    this.httpInterceptorsRequest()
    this.httpInterceptorsResponse()
  }

  /** 创建 axios 实例 */
  private createAxiosInstance(options: AxiosRequestConfig) {
    return axios.create({
      baseURL: BASE_API,
      isCancelToken: true,
      ...options,
    })
  }

  /** 添加请求拦截器 */
  private httpInterceptorsRequest() {
    this.instance.interceptors.request.use(
      (config) => {
        // 仅在第一个请求时启动进度条
        if (this.requestCount === 0)
          this.timer = setTimeout(() => NProgress.start(), 100)
        this.requestCount++

        // 根据后端要求： 请求头添加 Authorization token
        config.headers.Authorization = sessionStorage.getItem(TOKEN_NAME)

        // 保存原始的 url 和 baseURL
        config._originalBaseURL = config.baseURL
        config._originalUrl = config.url

        // 添加请求取消功能，默认开启
        if (config.isCancelToken)
          this.handleCancelToken(config)

        // console.log('【发起请求、成功】拦截器', this.cancelTokenSourceMap, config)
        return config
      },
      (error) => {
        clearTimeout(this.timer)
        NProgress.done()
        this.requestCount = 0

        // console.log('【发起请求、失败】拦截器\n', error)
        return Promise.reject(error)
      },
    )
  }

  /** 添加响应拦截器 */
  private httpInterceptorsResponse() {
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        clearTimeout(this.timer)
        this.requestCount--
        if (this.requestCount === 0)
          NProgress.done()

        // console.log('【响应成功】拦截器\n', response)
        this.removeCancelToken(response.config)

        // 检查 Content-Type 是否存在
        const contentType = response.headers['content-type']

        // 处理验证码接口的特殊情况
        if (response.config.url === '/login/getVerifyCode')
          return response.data

        // 如果 Content-Type 不存在，发出警告
        if (!contentType) {
          console.warn(
            '未检测到正确的 Content-Type，可能需要手动处理响应数据。',
            { response },
          )
          return response
        }

        // 根据 Content-Type 进行处理
        switch (contentType) {
          case 'application/octet-stream':
            return response

          case 'application/x-msdownload':
            return response

          default:
            console.log('其他响应类型', contentType)

            break
        }

        // 处理接口返回的错误消息
        if (response.data.code !== 0) {
          this.handleErrorNotification(response)

          return Promise.reject(response)
        }

        return response.data
      },
      (error) => {
        // console.log('【响应失败】拦截器\n', error)
        if (error.config)
          this.removeCancelToken(error.config)

        if (this.isTimeoutError(error)) {
          this.requestCount--
          return this.handleTimeoutError(error, this.Request.bind(this))
        }

        this.handleCommonErrors(error)

        clearTimeout(this.timer)
        this.requestCount--
        if (this.requestCount === 0)
          NProgress.done()

        return Promise.reject(error)
      },
    )
  }

  /** 默认 instance.request 请求方法 */
  public request<Res = any, Req = any>(config: AxiosRequestConfig<Req>) {
    return this.instance.request<any, Res, Req>(config)
  }

  /** 超时取消 请求方法 */
  public Request<Res = any, Req = any>(config: AxiosRequestConfig<Req>) {
    /** 取消请求的令牌 */
    const cancelToken = ref<CancelTokenSource>(axios.CancelToken.source())

    // 设置连接超时
    const timeoutId = setTimeout(() => {
      cancelToken.value.cancel('超时手动取消请求')
    }, config?.timeout ?? TIME_OUT)

    // 移除配置的timeout，手动控制超时
    config.timeout = undefined

    let isDownload = false

    return this.instance.request<any, ResponseData<Res>, Req>({
      onDownloadProgress: () => {
        if (isDownload)
          return
        clearTimeout(timeoutId)
        isDownload = true
      },
      cancelToken: cancelToken.value?.token,
      ...config,
    })
  }

  /** GET 请求方法 */
  public async GET<Res = any, Req = any>(url: string, config?: AxiosRequestConfig<Req>): Promise<Res> {
    return (await this.Request<Res, Req>({ url, method: 'GET', ...config })).data
  }

  /** POST 请求方法，响应为原始响应的 data 属性 */
  public async POST<Res = any, Req = any>(url: string, data: Req, config?: AxiosRequestConfig<Req>): Promise<Res> {
    return (await this.Request<Res, Req>({ url, data, method: 'POST', ...config })).data
  }

  /** 自动3次重试 请求方法 */
  public RetryRequest<Res = any, Req = any>(config: AxiosRequestConfig<Req>) {
    return this.instance.request<any, ResponseData<Res>, Req>({ method: 'POST', timeout: TIME_OUT, retry: RETRY, retryDelay: RETRY_DELAY, ...config })
  }

  /** GET 请求方法 */
  public async RetryGET<Res = any, Req = any>(url: string, config?: AxiosRequestConfig<Req>): Promise<Res> {
    return (await this.RetryRequest<Res, Req>({ url, method: 'GET', ...config })).data
  }

  /** POST 请求方法，响应为原始响应的 data 属性 */
  public async RetryPOST<Res = any, Req = any>(url: string, data: Req, config?: AxiosRequestConfig<Req>): Promise<Res> {
    return (await this.RetryRequest<Res, Req>({ url, data, method: 'POST', ...config })).data
  }

  /** DownLoad 请求方法 */
  public async DownLoad(config?: AxiosRequestConfig): Promise<void> {
    /** 取消请求的令牌 */
    const cancelToken = ref<CancelTokenSource>(axios.CancelToken.source())

    // 设置连接超时
    const timeoutId = setTimeout(() => {
      cancelToken.value.cancel('超时手动取消请求')
    }, config?.timeout ?? 1000 * 60)

    // 移除配置的timeout，手动使用 setTimeout 控制超时
    if (config?.timeout)
      config.timeout = undefined

    /** 下载完整标志 */
    let downloadCompleted = false

    try {
      const response = await this.instance.request({
        url: config?.url,
        data: config?.data,
        method: config?.method ?? 'POST',
        responseType: config?.responseType ?? 'blob',
        cancelToken: cancelToken.value?.token,
        onDownloadProgress: (progressEvent) => {
          if (downloadCompleted)
            return
          clearTimeout(timeoutId)

          const { lengthComputable, loaded, total, progress } = progressEvent

          if (progress) {
            const percentage = Math.floor(progress * 100) // 进度百分比，通常是 loaded 除以 total 的结果
            NProgress.set(percentage / 100) // 设置进度条
            console.log(`已加载字节数: ${loaded} / 总字节数: ${total}`)
          }

          if (!lengthComputable) { // 如果无法计算总进度，模拟进度条前进
            NProgress.inc() // 进度条略微前进
            console.log(`已加载字节数: ${loaded}`)
          }
        },
        ...config,
      })

      if (response.data.size === 0) {
        ElMessage.warning('请求数据为空，可能被拦截。跳过下载.')
        return
      }

      const contentDisposition = response.headers['content-disposition']
      const url = response.config._originalUrl
      let filename = 'unknown'

      if (contentDisposition) {
        try {
          const filenameMatch = contentDisposition.match(/filename\*?=(?:UTF-8'')?["']?([^"';]+)["']?/i)
          if (filenameMatch)
            filename = decodeURIComponent(filenameMatch[1])
        }
        catch (error) {
          console.warn('无法从 Content-Disposition 解析文件名:', error)
        }
      }
      else if (url) {
        filename = url.split('/').pop() || 'unknown'
      }

      // 创建 Blob URL 并触发下载
      const linkUrl = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.style.display = 'none'
      link.href = linkUrl
      link.setAttribute('download', filename)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      // 释放 Blob URL
      window.URL.revokeObjectURL(linkUrl)

      NProgress.done()
    }
    catch (error) {
      console.error('下载文件错误：', error)
    }
    finally {
      downloadCompleted = true
      NProgress.done()
    }
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

  /** 错误通知处理函数 */
  private handleErrorNotification(response: AxiosResponse) {
    const fullMessage = response.data.message ?? ''
    const [title, message] = fullMessage.includes(':')
      ? fullMessage.split(':', 2)
      : [undefined, fullMessage]

    ElNotification({
      type: 'error',
      customClass: 'break-all', // 断字，添加换行符
      title,
      message,
      offset: 54,
    })
  }

  /** 判断是否是请求超时错误 */
  private isTimeoutError(error: any): boolean {
    return error.code === 'ECONNABORTED' && error.message.includes('timeout')
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
        // 重试请求
        return retryRequest({ ...restConfig, baseURL: _originalBaseURL, url: _originalUrl, retry: retry - 1 })
      }
    }

    ElNotification({ type: 'error', title: '请求超时', offset: 54 })

    return Promise.reject(error)
  }

  /** 处理常见错误 */
  private handleCommonErrors(error: any): void {
    console.log('其他请求错误处理', error)
    if (error.response?.status === 401) {
      // 处理授权错误，例如跳转到登录页
    }
  }
}

// 创建 HttpClient 实例
const Http = new HttpClient()

export { Http, HttpClient, isCancel }
export type { CancelTokenSource, ResponseData }
