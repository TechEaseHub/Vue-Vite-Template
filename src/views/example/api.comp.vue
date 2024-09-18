<script lang="ts" setup>
/** 请求参数 */
export interface RequestParams {
    id: number
    name?: string
}
/** 响应数据 */
interface ResponseData {
    data: string
}

const props = defineProps<{
    /**
     * @default 抽屉标题
     */
    title?: string
    /**
     * 抽屉宽度
     * @default 500
     */
    size?: number
    /**
     * 请求参数
     * @type RequestParams
     */
    params?: RequestParams
}>()

const drawer = defineModel<boolean>('modelValue', { required: true })

const title = computed(() => props.title ?? '抽屉标题')
const size = computed(() => props.size ?? 500)

const loading = ref(true)
const data = ref<ResponseData>()

async function fetchData(params: RequestParams) {
    console.log('网络请求，查询数据\n', params)
    loading.value = true
    try {
        // 模拟一个网络请求
        data.value = await new Promise<ResponseData>((resolve) => {
            setTimeout(() => resolve({ data: 'Fetched Data' }), 1000)
        })
    }
    catch (error) {
        console.error('Error fetching data:', error)
    }
    finally {
        loading.value = false
    }
}

// 监听查询参数变化，查询新数据
watch(() => props.params, () => {
    if (drawer.value && props.params)
        fetchData(props.params)
}, { deep: true })
</script>

<template>
    <el-drawer v-model="drawer" class="api_comp-drawer" :title :size>
        <el-skeleton class="w-[240px]!" :loading="loading" animated>
            <template #template>
                <el-skeleton-item class="h-[240px]! w-[240px]!" variant="image" />
                <div class="p-[14px]">
                    <el-skeleton-item class="w-[50%]!" variant="h3" />
                    <div class="mt-[16px] h-[16px] flex items-center justify-between">
                        <el-skeleton-item class="mr-[16px]" variant="text" />
                        <el-skeleton-item class="w-[30%]!" variant="text" />
                    </div>
                </div>
            </template>
            <template #default>
                <div>
                    {{ data?.data }}
                </div>
            </template>
        </el-skeleton>
    </el-drawer>
</template>

<style lang="scss">

</style>
