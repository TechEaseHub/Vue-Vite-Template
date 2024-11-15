import type { FormInstance } from 'element-plus'

export interface ActionHandler<T> {
  Query: (params?: T) => void
  Add: () => void
  Edit: (row: T) => void
  Remove: (row: T) => void
  Submit: (formEl: FormInstance | undefined) => void
}
