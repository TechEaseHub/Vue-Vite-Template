<script setup lang="ts">
interface Options {
  label: string
  value: string | number
  disabled: boolean
}

defineProps<{
  options: Options[]
  isButton?: boolean
}>()

const value = defineModel<string | number | undefined>({ required: true })

// 获取未声明的属性，包括父组件可能传入的 `disabled` 属性
const attrs = useAttrs() as { disabled?: boolean }

function change(event: Event, option: Options) {
  event.preventDefault() // 阻止默认行为

  // 如果父组件设置了 `disabled` 属性，或选项被禁用，则不进行操作
  if (attrs.disabled || option.disabled)
    return

  // 如果点击的选项已经选中，则取消选中，否则选中该选项
  if (value.value === option.value)
    value.value = undefined
  else
    value.value = option.value
}
</script>

<template>
  <ElRadioGroup v-model="value">
    <template v-if="isButton">
      <ElRadioButton
        v-for="option in options"
        :key="option.value"
        :label="option.label"
        :value="option.value"
        :disabled="option.disabled || attrs.disabled"
        @click="(event) => change(event, option)"
      />
    </template>
    <template v-else>
      <ElRadio
        v-for="option in options"
        :key="option.value"
        :label="option.label"
        :value="option.value"
        :disabled="option.disabled || attrs.disabled"
        border
        @click="(event: any) => change(event, option)"
      />
    </template>
  </ElRadioGroup>
</template>
