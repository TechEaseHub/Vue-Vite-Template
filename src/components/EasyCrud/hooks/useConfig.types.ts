import type { ElDrawerType, ElFormType, ElPaginationType, ElTableType, Source, StringKeyOf } from './index.types'
import type { HooksConfig } from './useHooks.types'

/** 可选的 Prpos */
export interface CrudProps<T> {
  /**
   * DeBug 模式
   * @default false
   */
  debug?: boolean
  /**
   * 在 onMounted 后查询
   * @default false
   */
  isAfterMountQuery?: boolean

  /**
   * 当前页网络请求根 `url`
   */
  url: string
  /**
   * 表格行数据的 Key，用来优化 Table 的渲染；
   *
   * 在使用reserve-selection功能与显示树形数据时，该属性是必填的。
   */
  rowKey?: StringKeyOf<T>
  /**
   * 多主键，主要用作与网络请求时多主键参数
   */
  rowKeys?: StringKeyOf<T>[]

  /**
   * EasyCrud 数据提供者
   */
  source: Source<T>
  /**
   * 表单、表格、分页、抽屉 组件基础配置项
   */
  attrs?: Attrs
  /**
   * EasyCrud 函数执行期间钩子
   */
  hooks?: HooksConfig<T>

  /**
   * 网络请求的接口名称映射，与 `url` 进行拼接成完整的请求地址
   */
  apiEndpoints?: ApiEndpoints
  /**
   * 操作按钮权限
   */
  buttonAuth?: ButtonAuth

  /**
   * 表格配置
   */
  table?: TableConfig<T>
  /**
   * 分页配置
   */
  pagination?: PaginationConfig
}

/** 必定有值的 config （默认值 + props） */
export interface CrudConfig<T> {
  /**
   * DeBug 模式
   * @default false
   */
  debug: boolean
  /**
   * 在 onMounted 后查询
   * @default false
   */
  isAfterMountQuery: boolean

  /**
   * 当前页网络请求根 `url`
   */
  url: string
  /**
   * 表格行数据的 Key，用来优化 Table 的渲染；
   *
   * 在使用reserve-selection功能与显示树形数据时，该属性是必填的。
   */
  rowKey?: StringKeyOf<T>
  /**
   * 多主键，主要用作与网络请求时多主键参数
   */
  rowKeys?: StringKeyOf<T>[]

  /**
   * EasyCrud 数据提供者
   */
  source: Source<T>
  /**
   * 表单、表格、分页、抽屉 组件基础配置项
   */
  attrs: Attrs
  /**
   * EasyCrud 函数执行期间钩子
   */
  hooks: HooksConfig<T>

  /**
   * 网络请求的接口名称映射，与 `url` 进行拼接成完整的请求地址
   */
  apiEndpoints: ApiEndpoints
  /**
   * 操作按钮权限
   */
  buttonAuth: ButtonAuth

  /**
   * 表格配置
   */
  table: TableConfig<T>
  /**
   * 分页配置
   */
  pagination: PaginationConfig

}

export interface Attrs {
  /** 表单配置 */
  form?: Partial<ElFormType['$props']> & Partial<ElFormType['$emit']>
  /** 表单抽屉配置 */
  drawer?: Partial<ElDrawerType['$props']> & Partial<ElDrawerType['$emit']>
  /** 表格配置 */
  table?: Partial<ElTableType['$props']> & Partial<ElTableType['$emit']>
  /** 分页配置 */
  pagination?: Partial<ElPaginationType['$props']> & Partial<ElPaginationType['$emit']>
}

export interface TableConfig<T> {
  /**
   * 菜单可见状态
   * @default true
   */
  menuVisible?: boolean
  /**
   * 菜单对齐方式
   * @default 'center'
   */
  menuAlign?: 'left' | 'center' | 'right'
  /**
   * 菜单宽度
   * @default 150
   */
  menuWidth?: number

  /**
   * 菜单按钮名称是否显示
   * @default true
   */
  menuTitle?: boolean
  defButVisible?: (row: T) => boolean
}

export interface PaginationConfig {
  /**
   * 当前页数
   * @default 1
   */
  current?: number
  /**
   * 每页显示条目个数
   * @default 10
   */
  pageSize?: number
  /**
   * 每页显示个数选择器的选项设置
   * @default [10, 20, 50, 100]
   */
  pageSizes?: number[]
  /**
   * 组件布局，各子组件名称间使用逗号分隔:
   *
   * @ prev       - 上一页按钮
   * @ next       - 下一页按钮
   * @ pager      - 分页列表
   * @ jumper     - 跳转输入框
   * @ total      - 记录总数显示
   * @ sizes      - 每页显示条数选择器
   * @ ->         - 此符号之后的元素将被对齐至右侧
   * @default 'total, ->, sizes, prev, pager, next, jumper'
   */
  layout?: string
}

export interface ButtonAuth {
  /**
   * 新增权限
   * @default true
   */
  add?: boolean
  /**
   * 编辑权限
   * @default true
   */
  edit?: boolean
  /**
   * 删除权限
   * @default true
   */
  delete?: boolean
}

export interface ApiEndpoints {
  /**
   * 查询
   * @default 'query'
   */
  query?: string
  /**
   * 新增
   * @default 'add'
   */
  add?: string
  /**
   * 编辑
   * @default 'edit'
   */
  edit?: string
  /**
   * 删除
   * @default 'delete'
   */
  delete?: string
  /**
   * 标记删除
   * @default 'deleteFlag'
   */
  deleteFlag?: string
}
