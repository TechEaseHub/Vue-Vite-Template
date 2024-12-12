<!-- DynamicSlotsComp2 组件 -->
<script setup lang="ts">
defineSlots<{
  header: { name: string }
  default: void
  footer: void
}>()
</script>

<template>
  <div class="flex flex-col gap-4 p-4">
    <div class="rounded-lg bg-gray-3 p-4 shadow-sm">
      <!-- 分发名为 header 的插槽内容 -->
      <slot name="header" v-bind="{ name: 'Alice' }" />
    </div>
    <div class="rounded-lg bg-white p-4 shadow-sm">
      <!-- 分发默认插槽内容 -->
      <slot />
    </div>
    <div class="rounded-lg bg-gray-5 p-4 shadow-sm">
      <!-- 分发名为 footer 的插槽内容 -->
      <slot name="footer" />
    </div>
  </div>
</template>
