<script setup lang="ts">
import { h } from 'vue'

import TUXINAGCAIJI, { type Params } from './api.comp.vue'

import { Http } from '@/utils/http'

const router = useRouter()
const userStore = useUserStore()

definePage({
    path: '/example/api',
    meta: {
        title: 'API 接口',
        icon: 'i-ant-design:api-twotone',
        order: -90,
    },
})

// onBeforeRouteLeave((to, from, next) => {
//     console.log('Navigating away from', from, 'to', to)
//     ElMessageBox.confirm('表单有未保存的更改，您确定要离开吗？', '提示', {
//         confirmButtonText: '确认',
//         cancelButtonText: '取消',
//         type: 'warning',
//     })
//         .then(() => next())
//         .catch(() => next(false))
//     console.log(123)
// })

const url = ref('')
const data = ref('{}')
function fetchData() {
    Http.RetryPOST(url.value, JSON.parse(data.value)).then((Res) => {
        console.log(Res)
    })
}

const TUXDrawer = ref(false)
const TUXDrawerParams = ref<Params>()
function openTUXDrawer(key: number) {
    TUXDrawer.value = true
    // TUXDrawerParams.value = { ttId: key + Math.random() }
    TUXDrawerParams.value = { ttId: key }
}
</script>

<template>
    <div class="bg-[var(--el-bg-color)] p-20" border="~ rd-10">
        <div class="grid-2">
            <div class="grid-item">
                <div class="m-12 text-center text-24 font-bold">
                    <h2>/login/getVerifyCode</h2>
                </div>

                <el-input v-model="userStore.loginForm.userName" placeholder="用户名" />
                <el-input v-model="userStore.loginForm.password" placeholder="密码" />
                <el-switch v-model="userStore.loginForm.remember" :active-icon="h('i', { class: 'i-ep:check' })" :inactive-icon="h('i', { class: 'i-ep:close' })" />
                <el-image :src="userStore.verifyCodeSrc" style="width: 100px; height: 40px;" />
                <el-input v-model="userStore.loginForm.verifyCode" placeholder="验证码" />
                <ReButton @click="userStore.getVerifyCode">
                    Get VerifyCode
                </ReButton>
                <ReButton @click="userStore.login">
                    login
                </ReButton>
            </div>
            <div class="grid-item">
                <div class="m-12 text-center text-24 font-bold">
                    <h2>自定义请求</h2>
                </div>
                <el-input v-model="url" placeholder="请求路径" />
                <el-input v-model="data" placeholder="请求参数" />
                <ReButton @click="fetchData">
                    发起请求
                </ReButton>
            </div>
        </div>
    </div>
    <div class="bg-[var(--el-bg-color)] p-20" border="~ rd-10">
        <div class="m-12 text-center text-24 font-bold">
            <h2>/orgnization/export</h2>
        </div>
        <div class="grid-2">
            <div class="grid-item">
                1
                <el-button @click="() => router.push('/login')">
                    goLogin
                </el-button>
            </div>
            <div class="grid-item">
                <ReButton @click="() => Http.DownLoad('/class/export', { deleteFlag: 0 }, { timeout: 1000 * 10 })">
                    /class/export
                </ReButton>
            </div>
        </div>
        <div class="grid-2">
            <div class="grid-item">
                1
            </div>
            <div class="grid-item">
                TUXDrawer: {{ TUXDrawer }}
                <div v-for="key in [99883, 99884, 99846, 99809, 99845]" :key>
                    <ElButton @click="openTUXDrawer(key)">
                        图像采集{{ key }}
                    </ElButton>
                </div>
            </div>
        </div>
    </div>

    <TUXINAGCAIJI v-model="TUXDrawer" :params="TUXDrawerParams" />
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
        flex-wrap: wrap;
        background-color: var(--el-color-info-light-9);
    }
}
</style>
