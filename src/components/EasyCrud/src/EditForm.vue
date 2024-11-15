<script setup lang="ts" generic="T extends BaseRow">
import type { BaseRow, ColumnsType, ElFormType } from '../hooks/base.types'
import type { ActionHandler } from '../hooks/useActions.types'
import type { CrudConfig } from '../hooks/useConfig.types'
import type { FormStore } from '../hooks/useForm.types'

const props = defineProps<{ config: CrudConfig<T>, actionHandler: ActionHandler<T> }>()
const editFormRef = defineModel<ElFormType | undefined>('editFormRef', { required: true })
const formStore = defineModel<FormStore<T>>('formStore', { required: true })

const config = computed(() => props.config)
const actionHandler = computed(() => props.actionHandler)

const definitions = computed(() => config.value.source.definitions)
const editor = computed(() => config.value.source.fields.editor)

const { drawerTitle, drawerVisible, reset } = formStore.value

/** 判断是否禁用 */
function disabled<T>(definitions: ColumnsType<T>, key: keyof T): boolean {
  const column = definitions[key]
  return typeof column.disabled === 'function' ? column.disabled(drawerTitle.value) : false
}

/** 要显示的表单列表 visible */
const EditFormList = computed(() => {
  return editor.value.filter((key) => {
    return definitions.value[key]?.visible?.(drawerTitle.value) ?? true
  })
})
</script>

<template>
  <el-drawer v-model="drawerVisible" no-select :title="drawerTitle" :size="500" :close-on-click-modal="false" :destroy-on-close="true" v-bind="config.attrs.drawer" @close="reset(editFormRef, '编辑', true)">
    <template #default>
      <slot name="edit-form">
        <ElForm ref="editFormRef" :model="formStore.editForm" :label-width="120" :show-message="false" v-bind="config.attrs.form">
          <slot name="top" />

          <template v-for="key in EditFormList" :key="key">
            <ElFormItem :label="definitions[key]?.label" :prop="key" v-bind="{ ...definitions[key]?.formProps, ...definitions[key]?.formProps?.edit }">
              <component
                :is="definitions[key]?.type" v-model="formStore.editForm[key]"
                class="w-full!" clearable
                :disabled="disabled(definitions, key)"
                v-bind="{ ...definitions[key]?.componentProps, ...definitions[key]?.componentProps?.edit }"
              />
            </ElFormItem>
          </template>

          <slot name="bottom" />

          <button type="submit" style="display: none;" />
        </ElForm>
      </slot>
    </template>

    <template #footer>
      <div flex="~ justify-between items-center">
        <div>
          <el-button title="取消" @click="drawerVisible = !drawerVisible">
            取消
          </el-button>
          <el-button type="warning" plain title="重置" @click="reset(editFormRef, '编辑')">
            重置
          </el-button>
        </div>

        <el-button type="primary" title="提交" @click="actionHandler.Submit(editFormRef)">
          提交
        </el-button>
      </div>
    </template>
  </el-drawer>
</template>
