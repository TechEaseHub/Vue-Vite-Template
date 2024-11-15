import type { FormInstance } from 'element-plus'
import type { Ref } from 'vue'

/** 表单模式 */
export type FormMode = '新增' | '编辑' | '搜索'

export interface FormStore<T> {
  /**
   * 搜索表单是否可见
   * @default true
   *
   */
  formVisible: Ref<boolean>
  /**
   * 是否显示 新增/编辑 抽屉
   * @default false
   */
  drawerVisible: Ref<boolean>
  /**
   * 新增/编辑 抽屉标题
   * @default '新增'
   */
  drawerTitle: Ref<Exclude<FormMode, '搜索'>>

  /** 初始化的搜索表单参数 */
  _searchForm: T
  /** 搜索表单渲染值 */
  searchForm: T
  /** 初始化的新增/编辑表单参数 */
  _editForm: T
  /** 新增/编辑表单渲染值 */
  editForm: T

  /** 当前操作行数据 */
  currentRow: Ref<T>
  /** 最终提交时的表单参数 */
  formData: Ref<T | FormData>

  /**
   * 表单重置
   * @param mode 重置模式 search: 搜索表单, edit: 编辑表单
   */
  reset: (formEl: FormInstance | undefined, mode: Exclude<FormMode, '新增'>, close?: boolean) => void
}
