/** 搜索表单扩展 */
interface SearchExpansion {
  /** startTime起始值 */
  startTimeStart?: string
  /** startTime终止值 */
  startTimeEnd?: string
  /** endTime起始值 */
  endTimeStart?: string
  /** endTime终止值 */
  endTimeEnd?: string
  /** 当前页 */
  pagenum?: number
  /** 分页大小 */
  pagesize?: number
}

/** 表格扩展 */
export interface TableExpansion {
  /**
   * 表格 type 对应列的类型
   * 'default' | 'selection' | 'index' | 'expand'
   * 如果设置了 selection 则显示多选框； 如果设置了 index 则显示该行的索引（从 1 开始计算）； 如果设置了 expand 则显示为一个可展开的按钮
   */
  /** 表格可选框 */
  readonly selection?: any
  /** 表格索引 */
  readonly index?: any
  /** 展开行 */
  readonly expand?: any
}

/** 基础行的数据类型，包含搜索表单扩展、表格扩展、接口基础字段 */
export interface BaseRow extends TableExpansion, SearchExpansion {
  /** 数据行状态 */
  deleteFlag?: 0 | 1
  /** 操作人账号 */
  readonly operatorName?: string
  /** 创建时间 */
  readonly createTime?: string
  /** 更新时间 */
  readonly updateTime?: string
}
