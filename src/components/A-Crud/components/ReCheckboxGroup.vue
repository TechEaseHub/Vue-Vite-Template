<script setup lang="ts">
interface Options { label: string, value: string, disabled: boolean }
type Value = string | number | undefined

defineProps({
    options: {
        type: Array as PropType<Options[]>,
        required: true,
    },
    isButton: Boolean,
})

const value = defineModel<Value>({ required: true })
</script>

<template>
    <ElCheckboxGroup v-model="value">
        <template v-if="isButton">
            <ElCheckboxButton v-for="option in options" :key="option.value" :label="option.label" :value="option.value" :disabled="option.disabled" />
        </template>
        <template v-else>
            <ElCheckbox v-for="option in options" :key="option.value" :label="option.label" :value="option.value" :disabled="option.disabled" border />
        </template>
    </ElCheckboxGroup>
</template>
