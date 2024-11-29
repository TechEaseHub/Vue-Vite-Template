<script setup lang="ts">
definePage({
  meta: {
    title: '示例1（onMounted）',
    order: 1,
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
    ONE
    <el-input v-model="value" />
  </div>
</template>

<style scoped lang="scss">

</style>
