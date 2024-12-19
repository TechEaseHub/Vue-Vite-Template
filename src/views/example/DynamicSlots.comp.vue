<script setup lang="ts">
import { h } from 'vue'
import DynamicSlotsComp2 from './DynamicSlots.comp2.vue'
</script>

<template>
  <div>
    <h1>动态插槽组件</h1>
    <component :is="h(DynamicSlotsComp2, $attrs, $slots)" />
  </div>
</template>
