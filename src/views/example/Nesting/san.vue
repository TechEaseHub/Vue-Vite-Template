<script setup lang="ts">
definePage({
  meta: {
    // isMenu: true,
    title: '示例2-3',
    order: 2,
  },
})

const value = ref('SAN')
</script>

<template>
  <div class="div-c">
    子——SAN
    <el-input v-model="value" />
  </div>
</template>

<style scoped lang="scss">

</style>
