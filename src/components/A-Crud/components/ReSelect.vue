<script setup lang="ts">
import axios, { type CancelTokenSource } from 'axios'
import type { VNode } from 'vue'

interface OptionItemType {
    label: string
    value: string | number
    disabled?: boolean
}

defineProps<{
    options: OptionItemType[]
    render?: (item: OptionItemType) => VNode
}>()
// TODO: 添加动态插槽

/**
 * 使用 onRemoteMethod 触发远程搜索
 */
const emit = defineEmits<{
    remoteMethod: [ query: string, cancelToken: Ref<CancelTokenSource | undefined>, closeLoading: () => void]
    iifeFocus: [cancelToken: Ref<CancelTokenSource | undefined>, closeLoading: () => void]
}>()

const value = defineModel<OptionItemType['value'] | undefined>({ required: true })

/** 查询加载中状态 */
const loading = ref(false)
/** 是否正在中文合成拼音 */
const isComposition = ref(false)
/** 取消请求的令牌 */
const cancelToken = ref<CancelTokenSource>()

const instance = getCurrentInstance()

// 检查父组件是否监听了某个事件
function hasListener(eventName: string) {
    const attrs = instance?.vnode.props || {}
    return `on${eventName.charAt(0).toUpperCase() + eventName.slice(1)}` in attrs
}

function focus() {
    // console.log('聚焦\n', cancelToken.value)
    if (cancelToken.value) {
        cancelToken.value.cancel('[ReSelect] 聚焦, 取消重复请求')
        cancelToken.value = undefined
    }

    // 创建请求令牌
    cancelToken.value = axios.CancelToken.source()

    // 如果使用了 iifeFocus 事件，可以在聚焦时自动执行函数
    if (hasListener('iifeFocus'))
        loading.value = true

    // 开启加载状态
    emit('iifeFocus', cancelToken, () => loading.value = false)
}
function blur() {
    // 使用请求令牌取消请求
    if (cancelToken.value) {
        cancelToken.value.cancel('[ReSelect] 失焦, 取消请求')
        cancelToken.value = undefined
    }

    // console.log('失焦\n', cancelToken.value)
}

function remoteMethod(query: string) {
    if (!query)
        return
    if (isComposition.value)
        return

    // 开启加载状态
    loading.value = true
    emit('remoteMethod', query, cancelToken, () => loading.value = false)
}
</script>

<template>
    <ElSelect
        v-model="value" :loading="loading"
        :remote-method="remoteMethod"
        v-bind="$attrs"
        @compositionstart="isComposition = true"
        @compositionend="isComposition = false"
        @blur="blur"
        @focus="focus"
    >
        <template #loading>
            <el-icon class="is-loading">
                <i class="i-uiw:loading" />
            </el-icon>
        </template>

        <template v-if="!render">
            <ElOption v-for="item in options" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled" />
        </template>
        <template v-else>
            <ElOption v-for="item in options" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled">
                <component :is="render(item)" />
            </ElOption>
        </template>
    </ElSelect>
</template>

<style scoped lang="scss">
</style>
