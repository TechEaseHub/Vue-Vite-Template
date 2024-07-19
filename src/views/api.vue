<script setup lang="ts">
import * as LoginApi from '@/api/login'

definePage({
    path: '/api',
    name: 'API',
    meta: {
        title: 'API',
        icon: 'i-ant-design:api-twotone',
    },
})

const imageSrc = ref('')
function getVerifyCode() {
    LoginApi.getVerifyCode().then(blob => imageSrc.value = window.URL.createObjectURL(blob))
}

function login() {
    LoginApi.login(LoginApi.loginRequest).then((Res) => {
        // 把Authorization存到localStorage
        sessionStorage.setItem('Authorization', Res.token)
        ElMessage.success('登录成功')
    })
}

function orgnization(key: string) {
    console.log(key)
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
    <div class="bg-[var(--el-bg-color)] p-20" border="~ rd-10">
        <div class="m-12 text-center text-24 font-bold">
            <h2>/login/login</h2>
        </div>
        <div class="grid-2">
            <div class="grid-item">
                <el-input v-model="LoginApi.loginRequest.userName" placeholder="用户名" />
                <el-input v-model="LoginApi.loginRequest.password" placeholder="密码" />
                <el-input v-model="LoginApi.loginRequest.verifyCode" placeholder="验证码" />
            </div>
            <div class="grid-item">
                <el-button @click="login">
                    login
                </el-button>
            </div>
        </div>
    </div>
    <div class="bg-[var(--el-bg-color)] p-20" border="~ rd-10">
        <div class="m-12 text-center text-24 font-bold">
            <h2>/orgnization</h2>
        </div>
        <div class="grid-2">
            <div class="grid-item">
                <el-input v-model="LoginApi.loginRequest.userName" placeholder="用户名" />
                <el-input v-model="LoginApi.loginRequest.password" placeholder="密码" />
                <el-input v-model="LoginApi.loginRequest.verifyCode" placeholder="验证码" />
            </div>
            <div class="grid-item">
                <el-button @click="orgnization('query')">
                    query
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
