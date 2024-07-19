<script setup lang="ts">
import { Http } from '@/utils/http'

defineOptions({ name: 'ReDeleteFlag' })

const props = defineProps<{
    url: string
    formData: Record<string, any>
}>()
const value = defineModel<0 | 1>({ required: true })
const loading = ref(false)

function beforeChange(): Promise<boolean> {
    return new Promise((resolve) => {
        ElMessageBox.confirm('确定要改变当前行数据状态吗？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
            .then(() => {
                loading.value = true

                Http.CrudRequest({
                    url: props.url,
                    data: props.formData,
                }).then(() => {
                    ElMessage({ type: 'success', message: '修改成功' })
                    loading.value = false
                    resolve(true)
                }).catch(() => {
                    ElMessage({ type: 'error', message: '修改失败' })
                    loading.value = false
                    resolve(false)
                })
            })
            .catch(() => {
                ElMessage({ type: 'info', message: '已取消' })
                loading.value = false
                resolve(false)
            })
    })
}
</script>

<template>
    <ElSwitch
        v-model="value"
        :active-value="0"
        :inactive-value="1"
        :before-change="beforeChange"
        :loading="loading"
        style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
    />
</template>
