<script setup lang="ts">
definePage({
  meta: {
    title: '示例2',
    order: 2,
  },
})

const value = ref('TWO')
</script>

<template>
  <div class="div-c">
    TWO
    <el-input v-model="value" />
  </div>
</template>

<style scoped lang="scss">

</style>
