<script setup lang="ts">
definePage({
  meta: {
    title: '示例2-2',
    order: 3,
  },
})

const value = ref('TWO')
</script>

<template>
  <div class="div-c">
    子——TWO
    <el-input v-model="value" />
  </div>
</template>

<style scoped lang="scss">

</style>
