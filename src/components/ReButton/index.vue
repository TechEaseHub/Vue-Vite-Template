<script setup lang="ts" generic="T">
defineOptions({ name: 'ReButton' })

// 在 defineProps 中使用泛型 T
const props = defineProps<{
  onClick: () => Promise<void | T> | void
}>()

// 定义一个响应式变量，用于跟踪按钮的加载状态
const loading = ref(false)

// 处理按钮点击事件的函数
async function handleClick() {
  // 设置加载状态为 true，表示按钮处于加载中，禁用按钮
  loading.value = true
  try {
    // 执行传入的 onClick 函数，等待其完成
    await props.onClick()
  }
  finally {
    // 不论 onClick 成功或失败，最终都将加载状态设置为 false，启用按钮
    loading.value = false
  }
}
</script>

<template>
  <ElButton
    :loading="loading"
    :disabled="loading"
    v-bind="$attrs"
    @click="handleClick"
  >
    <slot />
  </ElButton>
</template>
