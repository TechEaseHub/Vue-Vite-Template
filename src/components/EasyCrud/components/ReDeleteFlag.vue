<script setup lang="ts">
import { Http } from '@/utils/http'

defineOptions({ name: 'ReDeleteFlag' })

const props = defineProps<{
  url: string // 请求的 URL
  formData: Record<string, any> // 提交的表单数据
}>()

const value = defineModel<0 | 1>({ required: true })

// 加载状态
const loading = ref(false)

// 使用 async/await 优化的异步逻辑，用于在切换状态前确认操作
async function beforeChange(): Promise<boolean> {
  return new Promise((resolve) => {
    ElMessageBox.confirm('确定要改变当前行数据状态吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(async () => {
        loading.value = true

        try {
          await Http.EasyCrudRequest({
            url: props.url,
            data: props.formData,
          })
          ElMessage({ type: 'success', message: '修改成功' })
          resolve(true)
        }
        catch {
          ElMessage({ type: 'error', message: '修改失败' })
          resolve(false)
        }
        finally {
          // 无论成功与否，都将加载状态设置为 false
          loading.value = false
        }
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
