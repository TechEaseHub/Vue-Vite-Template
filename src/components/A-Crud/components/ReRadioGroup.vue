<script setup lang="ts">
interface Options { label: string, value: string | number, disabled: boolean }

defineProps<{
    options: Options[]
    isButton?: boolean
}>()

const value = defineModel<string | number | undefined>({ required: true })

function change(event: Event, attrs: any, option: Options) {
    event.preventDefault()

    if (attrs.disabled || option.disabled)
        return

    // 如果点击相同的，就取消选中
    if (value.value === option.value)
        value.value = undefined
    else
        value.value = option.value
}
</script>

<template>
    <ElRadioGroup v-model="value">
        <template v-if="isButton">
            <ElRadioButton v-for="option in options" :key="option.value" :label="option.label" :value="option.value" :disabled="option.disabled" @click="(event: Event) => change(event, $attrs, option)" />
        </template>
        <template v-else>
            <ElRadio v-for="option in options" :key="option.value" :label="option.label" :value="option.value" :disabled="option.disabled" border @click="(event: Event) => change(event, $attrs, option)" />
        </template>
    </ElRadioGroup>
</template>
