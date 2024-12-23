import type {
  Attrs,
  Config,
  DefineForm,
  HooksConfig,
  Source,
  StringKeyOf,
  UseConfigReturnType,
  UseFormReturnType,
  UseTableReturnType,
} from './hooks'

export interface CrudProps<T> {
  /** 是否开启调试模式 */
  debug?: boolean
  /** 是否在挂载后立即查询 */
  isAfterMountQuery?: boolean
  /** 请求的URL */
  url: string
  /** 数据源配置 */
  source: Source<T>
  /** 行的唯一标识键 */
  rowKey?: StringKeyOf<T>
  /** 多行的唯一标识键数组 */
  rowKeys?: StringKeyOf<T>[]
  /** 组件属性配置 */
  attrs?: Attrs
  /** 表格配置 */
  table?: Config['table']
  /** 分页配置 */
  pagination?: Config['pagination']
  /** API端点配置 */
  apiEndpoints?: Config['apiEndpoints']
  /** 按钮权限配置 */
  buttonAuth?: Config['buttonAuth']
  /** 钩子函数配置 */
  hooks?: HooksConfig<T>
}
export interface CrudEmits<T> {
  (event: 'change', mode: 'searchForm' | 'editForm', form: DefineForm<T>, key: keyof T): void
}
export interface CrudOptions<T> {
  configStore: UseConfigReturnType<T>
  formStore: UseFormReturnType<T>
  tableStore: UseTableReturnType<T>
}

/** 查询响应 */
export interface RequestResult<T> {
  /** 后端返回的状态码 */
  code: number
  /** 处理消息 */
  message: string
  /** 数据 */
  data: T[]
  /** 分页 */
  page: {
    /** 当前页 */
    pageNum: number
    /** 分页大小 */
    pageSize: number
    /** 总页数 */
    pages: number
    /** 总条数 */
    total: number
  } | null
}

export * from './components'
export * from './config'
export * from './hooks'
export * from './src'
