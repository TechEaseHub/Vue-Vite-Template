<script setup lang="ts" generic="T extends BaseRow">
import type { BaseRow, DynamicStoreReturnType } from '..'

const DynamicStore = inject<DynamicStoreReturnType<BaseRow>>('DynamicStore')!

const { attrs, source } = storeToRefs(DynamicStore.configStore)
const { drawerTitle, drawerVisible, editForm } = storeToRefs(DynamicStore.formStore)

const title = computed(() => drawerTitle.value === 'Add' ? '新增' : '编辑')

/** 要显示的表单列表 visible */
const EditFormList = computed(() => {
  return source.value.fields.editor.filter((key) => {
    return source.value.definitions[key]?.visible?.(drawerTitle.value) ?? true
  })
})

const formProps = computed(() => {
  return (key: keyof T) => {
    const props = source.value.definitions[key]?.formProps || {}
    const searchProps = source.value.definitions[key]?.formProps?.search || {}
    return { ...props, ...searchProps }
  }
})

const compProps = computed(() => {
  return (key: keyof T) => {
    const props = source.value.definitions[key]?.componentProps || {}
    const searchProps = source.value.definitions[key]?.componentProps?.search || {}
    return { clearable: true, ...props, ...searchProps }
  }
})
</script>

<template>
  <el-drawer v-model="drawerVisible" no-select :title="title" :size="500" :close-on-click-modal="false" :destroy-on-close="true" v-bind="attrs.drawer">
    <template #default>
      <slot name="edit-form">
        <ElForm :model="editForm" :label-width="120" :show-message="false" v-bind="attrs.form">
          <slot name="edit-form-top" />

          <template v-for="key in EditFormList" :key="key">
            <ElFormItem :label="source.definitions[key]?.label" :prop="key" v-bind="formProps(key)">
              <component :is="source.definitions[key]?.type" v-model="editForm[key]" class="w-full!" v-bind="compProps(key)" />
            </ElFormItem>
          </template>

          <slot name="edit-form-bottom" />

          <button type="submit" style="display: none;" />
        </ElForm>
      </slot>
    </template>

    <template #footer>
      <div class="flex items-center justify-between">
        <div>
          <el-button title="取消" @click="drawerVisible = !drawerVisible">
            取消
          </el-button>
          <el-button type="warning" plain title="重置">
            重置
          </el-button>
        </div>

        <el-button type="primary" title="提交">
          提交
        </el-button>
      </div>
    </template>
  </el-drawer>
</template>
