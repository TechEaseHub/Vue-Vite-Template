<script setup lang="ts">
import type { CheckboxGroupValueType } from 'element-plus'

defineOptions({ name: 'ReCheckboxGroup' })

const { options = [], isButton } = defineProps<{
  options: {
    label: string
    value: string
    disabled?: boolean
  }[]
  isButton?: boolean
}>()

// 定义双向绑定的modelValue，类型为CheckboxGroupValueType或undefined，且为必填
const modelValue = defineModel<CheckboxGroupValueType | undefined>({ required: true })

// 根据isButton属性动态选择使用ElCheckboxButton或ElCheckbox组件
const Checkbox = computed(() => isButton ? ElCheckboxButton : ElCheckbox)
</script>

<template>
  <!-- 使用ElCheckboxGroup组件，绑定modelValue -->
  <ElCheckboxGroup v-model="modelValue">
    <!-- 动态渲染选项 -->
    <component
      :is="Checkbox"
      v-for="option in options"
      :key="option.value"
      :label="option.label"
      :value="option.value"
      :disabled="option.disabled"
      v-bind="!isButton && { border: true }"
    />
  </ElCheckboxGroup>
</template>
