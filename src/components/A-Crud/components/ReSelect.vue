<script setup lang="ts">
import axios, { type CancelTokenSource } from 'axios'

interface OptionItemType {
    label: string
    value: string
    disabled: boolean
}

defineProps<{
    options: OptionItemType[]
}>()

/**
 * 使用 onRemoteMethod 触发远程搜索
 */
const emit = defineEmits<{
    (e: 'remoteMethod', query: string, cancelToken: Ref<CancelTokenSource | undefined>, closeLoading: () => void): void
}>()

const value = defineModel({ required: true })

/** 查询加载中状态 */
const loading = ref(false)
/** 是否正在中文合成拼音 */
const isComposition = ref(false)
/** 取消请求的令牌 */
const cancelToken = ref<CancelTokenSource>()

function focus() {
    // console.log('聚焦\n', cancelToken.value)
    if (cancelToken.value) {
        cancelToken.value.cancel('[ReSelect] 聚焦, 取消重复请求')
        cancelToken.value = undefined
    }

    // 创建请求令牌
    cancelToken.value = axios.CancelToken.source()
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
        v-model="value" :loading
        :remote-method="remoteMethod"
        v-bind="$attrs"
        @compositionstart="() => isComposition = true"
        @compositionend="() => isComposition = false"
        @blur="blur"
        @focus="focus"
    >
        <ElOption v-for="item in options" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled" />
        <template #loading>
            <el-icon class="is-loading">
                <i class="i-uiw:loading" />
            </el-icon>
        </template>
    </ElSelect>
</template>

<style scoped lang="scss">

</style>
