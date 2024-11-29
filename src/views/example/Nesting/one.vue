<script setup lang="ts">
definePage({
  meta: {
    title: '示例1-1',
    order: 3,
  },
})

const value = ref('ONE')

onMounted(() => {
  console.log('onMounted: 初始化逻辑')
})

onActivated(() => {
  console.log('onActivated: 组件激活时的逻辑')
})

onUnmounted(() => {
  console.log('onUnmounted')
})
</script>

<template>
  <div class="div-c">
    子——ONE
    <el-input v-model="value" />
  </div>
</template>

<style scoped lang="scss">

</style>
