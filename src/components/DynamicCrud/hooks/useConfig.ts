import type { BaseRow, DefineForm, ElDrawerType, ElFormType, ElPaginationType, ElTableType, HooksConfig, Source, StringKeyOf } from '../index'
import { merge } from 'lodash-es'

export interface CrudProps<T extends BaseRow> {
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

  /** 当前页网络请求根 `url` */
  url: string
  /** EasyCrud 数据提供者 */
  source: Source<T>

  /** 表格行数据的 Key，用来优化 Table 的渲染 */
  rowKey?: StringKeyOf<T>
  /** 多主键，主要用作与网络请求时多主键参数 */
  rowKeys?: StringKeyOf<T>[]

  /** 表单、表格、分页、抽屉 组件基础配置项 */
  attrs?: Attrs
  /** 表格配置 */
  table?: TableConfig
  /** 分页配置 */
  pagination?: PaginationConfig

  /** 网络请求的接口名称映射，与 `url` 进行拼接成完整的请求地址 */
  apiEndpoints?: ApiEndpoints
  /** 操作按钮权限 */
  buttonAuth?: ButtonAuth

  /** EasyCrud 函数执行期间钩子 */
  hooks?: HooksConfig<T>
}

export interface CrudEmits<T> {
  (event: 'change:searchForm', form: DefineForm<T>, key: keyof T): void
  (event: 'change:editForm', form: DefineForm<T>, key: keyof T): void
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

export interface TableConfig {
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
   * @default [1, 5, 10, 50]
   */
  pageSizes?: number[]
  /**
   * 组件布局，各子组件名称间使用逗号分隔:
   * @param prev 上一页按钮
   * @param next 下一页按钮
   * @param pager 分页列表
   * @param jumper 跳转输入框
   * @param total 记录总数显示
   * @param sizes 每页显示条数选择器
   * @param -> 此符号之后的元素将被对齐至右侧
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

/** 自定义配置默认值 */
function defaultTable(): TableConfig {
  return {
    menuVisible: true,
    menuAlign: 'center',
    menuWidth: 150,
    menuTitle: true,
  }
}

const defaultPagination: PaginationConfig = {
  current: 1,
  pageSize: 10,
  pageSizes: [1, 5, 10, 50],
  layout: 'total, ->, sizes, prev, pager, next, jumper',
}

const defaultButtonAuth: ButtonAuth = {
  add: true,
  edit: true,
  delete: true,
}

const defaultApiEndpoints: ApiEndpoints = {
  query: 'query',
  add: 'add',
  edit: 'edit',
  delete: 'delete',
  deleteFlag: 'deleteFlag',
}

export type UseConfigReturnType<T extends BaseRow> = ReturnType<typeof useConfig<T>>
export function useConfig<T extends BaseRow>(id: string, props?: CrudProps<T>) {
  return defineStore(`${id}__config`, () => {
    const searchFormRef = ref<ElFormType>()
    const editFormRef = ref<ElFormType>()

    const debug = computed(() => props?.debug ?? false)
    const isAfterMountQuery = computed(() => props?.isAfterMountQuery ?? false)

    const source = computed(() => {
      const def: Source<T> = {
        definitions: {} as Source<T>['definitions'],
        fields: {
          filter: [],
          editor: [],
          expand: [],
          column: [],
        },
      }

      return props?.source ?? def
    })

    const url = computed(() => props?.url)
    const rowKey = computed(() => props?.rowKey)
    const rowKeys = computed(() => props?.rowKeys)

    // 动态属性
    const attrs = computed<Attrs>(() => ({
      form: { labelWidth: 120, ...props?.attrs?.form },
      drawer: { size: 500, ...props?.attrs?.drawer },
      table: { ...props?.attrs?.table },
      pagination: { ...props?.attrs?.pagination },
    }))

    const table = computed<TableConfig>(() => merge(defaultTable(), props?.table || {}))
    const pagination = computed<PaginationConfig>(() => merge(defaultPagination, props?.pagination || {}))
    const buttonAuth = computed<ButtonAuth>(() => merge(defaultButtonAuth, props?.buttonAuth || {}))
    const apiEndpoints = computed<ApiEndpoints>(() => merge(defaultApiEndpoints, props?.apiEndpoints || {}))

    const hooks = computed(() => props?.hooks || {})

    return {
      searchFormRef,
      editFormRef,

      /** DeBug 模式 */
      debug,
      /** 在 onMounted 后查询 */
      isAfterMountQuery,

      /** 当前页网络请求根 `url` */
      url,
      /** EasyCrud 数据提供者 */
      source,
      /** 表格行数据的 Key，用来优化 Table 的渲染 */
      rowKey,
      /** 多主键，主要用作与网络请求时多主键参数 */
      rowKeys,

      /** 表单、表格、分页、抽屉 组件基础配置项 */
      attrs,
      /** 表格配置 */
      table,
      /** 分页配置 */
      pagination,
      /** 操作按钮权限 */
      buttonAuth,
      /** 网络请求的接口名称映射，与 `url` 进行拼接成完整的请求地址 */
      apiEndpoints,
      /** EasyCrud 函数执行期间钩子 */
      hooks,
    }
  })()
}
