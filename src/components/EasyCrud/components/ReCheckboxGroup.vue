<script setup lang="ts">
import type { CheckboxGroupValueType } from 'element-plus'

defineOptions({ name: 'ReCheckboxGroup' })

defineProps<{
  options: Option[]
  isButton?: boolean
}>()

// 选项的接口
interface Option {
  label: string // 显示的标签文本
  value: string // 选项的值
  disabled?: boolean // 是否禁用该选项（可选）
}

const modelValue = defineModel<CheckboxGroupValueType | undefined>({ required: true })
</script>

<template>
  <ElCheckboxGroup v-model="modelValue">
    <template v-if="isButton">
      <ElCheckboxButton
        v-for="option in options"
        :key="option.value"
        :label="option.label"
        :value="option.value"
        :disabled="option.disabled"
      />
    </template>
    <template v-else>
      <ElCheckbox
        v-for="option in options"
        :key="option.value"
        :label="option.label"
        :value="option.value"
        :disabled="option.disabled"
        border
      />
    </template>
  </ElCheckboxGroup>
</template>
