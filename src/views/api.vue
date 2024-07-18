<script setup lang="ts">
import { User } from '@/api'

definePage({
    path: '/api',
    name: 'API',
    meta: {
        title: 'API',
        icon: 'i-ant-design:api-twotone',
    },
})

const UserApi = new User()
const imageSrc = ref('')
function getVerifyCode() {
    UserApi.getVerifyCode().then(Res => imageSrc.value = window.URL.createObjectURL(Res))
}
</script>

<template>
    <div class="bg-[var(--el-bg-color)] p-20" border="~ rd-10">
        <div class="m-12 text-center text-24 font-bold">
            <h2>/login/getVerifyCode</h2>
        </div>
        <div class="grid-2">
            <div class="grid-item">
                <el-image :src="imageSrc" style="width: 100px; height: 40px;" />
            </div>
            <div class="grid-item">
                <el-button @click="getVerifyCode">
                    Get VerifyCode
                </el-button>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.grid-2 {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    > .grid-item {
        padding: 12px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: var(--el-color-info-light-9);
    }
}
</style>
