<!-- 使用 DynamicSlots 组件的父组件 -->
<script setup lang="ts">
import DynamicSlots from './DynamicSlots.comp.vue'
</script>

<template>
  <DynamicSlots>
    <template #header="{ name }">
      <h1>这是头部内容</h1>
      <p>{{ name }}</p>
    </template>
    <template #default>
      <p>这是默认插槽的内容</p>
    </template>
    <template #footer>
      <footer>这是底部内容</footer>
    </template>
  </DynamicSlots>
</template>
