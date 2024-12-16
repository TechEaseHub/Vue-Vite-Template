<script setup lang="ts">
import DynamicSlotsComp2 from './DynamicSlots.comp2.vue'

// 定义插槽类型
defineSlots<{
  header: { name: string } // header 插槽接收作用域参数
  default: void // 默认插槽不接收参数
  footer: void // footer 插槽不接收参数
}>()

const slots = useSlots()
// 使用 keyof 提取插槽名称类型
const slotNames = Object.keys(slots || {}) as (keyof typeof slots)[]
console.log(slotNames)
</script>

<template>
  <DynamicSlotsComp2>
    <template v-for="name in slotNames" #[name]="slotData">
      {{ console.log(name, slotData) }}
      <slot :name="name" v-bind="typeof slotData === 'object' ? slotData : {}" />
    </template>
  </DynamicSlotsComp2>
</template>
