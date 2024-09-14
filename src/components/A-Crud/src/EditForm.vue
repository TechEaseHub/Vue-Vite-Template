<script setup lang="ts" generic="T extends BaseRow">
import type { BaseRow, ColumnsType, CrudOptions } from '../hooks/index.types'

const crudOptions = inject('crudOptions') as CrudOptions<BaseRow>

const editForm = defineModel<T>('modelValue', { required: true })
const {
    Ref: { EditFormRef },
    config: { source: { fields: { editor }, definitions }, attrs },
    formStores: { drawerVisible, drawerTitle, reset },
    actionHandler: { Submit },
} = crudOptions

/** 判断是否禁用 */
function disabled<T>(definitions: ColumnsType<T>, key: keyof T): boolean {
    const column = definitions[key]
    return typeof column.disabled === 'function' ? column.disabled(drawerTitle.value) : false
}

/** 要显示的表单列表 visible */
const EditFormList = computed(() => {
    return editor.filter((key) => {
        return definitions[key]?.visible?.(drawerTitle.value) ?? true
    })
})
</script>

<template>
    <el-drawer v-model="drawerVisible" no-select :title="drawerTitle" :size="500" :close-on-click-modal="false" :destroy-on-close="true" @close="reset(EditFormRef, '编辑', true)" v-bind="attrs.drawer">
        <template #default>
            <slot name="edit-form">
                <ElForm ref="EditFormRef" :model="editForm" :label-width="120" :show-message="false" @submit.prevent="Submit(EditFormRef)" v-bind="attrs.form">
                    <slot name="top" />

                    <template v-for="key in EditFormList" :key="key">
                        <ElFormItem :label="definitions[key]?.label" :prop="key" v-bind="{ ...definitions[key]?.formProps, ...definitions[key]?.formProps?.edit }">
                            <component
                                :is="definitions[key]?.type" v-model="editForm[key]"
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
                    <el-button type="warning" plain title="重置" @click="reset(EditFormRef, '编辑')">
                        重置
                    </el-button>
                </div>

                <el-button type="primary" title="提交" @click="Submit(EditFormRef)">
                    提交
                </el-button>
            </div>
        </template>
    </el-drawer>
</template>
