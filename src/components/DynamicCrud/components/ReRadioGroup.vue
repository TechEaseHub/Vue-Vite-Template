<script setup lang="ts">
defineOptions({ name: 'ReRadioGroup' })

const { options = [], isButton } = defineProps<{
  options: {
    label: string
    value: string | number
    disabled?: boolean
  }[]
  isButton?: boolean
}>()

const modelValue = defineModel<string | number | undefined | undefined>({ required: true })

const { disabled: parentDisabled } = useAttrs() as { disabled?: boolean }

const Radio = computed(() => isButton ? ElRadioButton : ElRadio)

function change(event: Event, option: { value: string | number, disabled?: boolean }) {
  event.preventDefault()
  if (parentDisabled || option.disabled)
    return

  modelValue.value = modelValue.value === option.value ? undefined : option.value
}
</script>

<template>
  <ElRadioGroup v-model="modelValue">
    <component
      :is="Radio"
      v-for="option in options"
      :key="option.value"
      :label="option.label"
      :value="option.value"
      :disabled="option.disabled || parentDisabled"
      v-bind="!isButton && { border: true }"
      @click="(event:Event) => change(event, option)"
    />
  </ElRadioGroup>
</template>
