<script setup lang="ts" generic="T = any">
import type { FormInstance } from 'element-plus'
import type { Attrs, ColumnsItemType, CrudOptions } from '..'

const { crudOptions } = defineProps<{ crudOptions: CrudOptions<T>, attrs?: Attrs }>()

const editForm = defineModel <Record<string, any>>({ required: true })
const {
    source: { fields: { editor }, columns },
    FormStore: { FormEditRef, drawerVisible, drawerTitle, reset },
    ActionHandler: { Submit },
} = crudOptions as CrudOptions<any>

/** 判断是否禁用 */
function disabled(column: ColumnsItemType<T>): boolean {
    return typeof column.disabled === 'function' ? column.disabled(drawerTitle.value) : false
}

/** 要显示的表单列表 visible */
const EditFormList = computed(() => {
    return editor.filter((key) => {
        return columns[key].visible?.(drawerTitle.value) ?? true
    })
})
</script>

<template>
    <el-drawer v-model="drawerVisible" no-select :title="drawerTitle" size="500px" :close-on-click-modal="false" :destroy-on-close="true" v-bind="attrs?.drawer" @close="reset(FormEditRef, 'edit')">
        <template #default>
            <slot name="edit-form">
                <ElForm :ref="el => { FormEditRef = el as FormInstance }" :model="editForm" label-width="120px" :show-message="false" v-bind="attrs?.form">
                    <template v-for="key in EditFormList" :key="key">
                        <ElFormItem :label="columns[key].label" :prop="key" v-bind="{ ...columns[key]?.formProps, ...columns[key]?.formProps?.edit }">
                            <component
                                :is="columns[key].type" v-model="editForm[key]"
                                class="w-full!" clearable
                                :disabled="disabled(columns[key])"
                                v-bind="{ ...columns[key]?.componentProps, ...columns[key]?.componentProps?.edit }"
                            />
                        </ElFormItem>
                    </template>
                </ElForm>
            </slot>
        </template>

        <template #footer>
            <div flex="~ justify-between items-center">
                <div>
                    <el-button title="取消" @click="drawerVisible = !drawerVisible">
                        取消
                    </el-button>
                    <el-button type="warning" plain title="重置" @click="reset(FormEditRef, 'edit')">
                        重置
                    </el-button>
                </div>

                <el-button type="primary" title="提交" @click="Submit(FormEditRef)">
                    提交
                </el-button>
            </div>
        </template>
    </el-drawer>
</template>

<style scoped lang="scss">

</style>
