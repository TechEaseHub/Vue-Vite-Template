<script setup lang="ts">
import { h } from 'vue'

const userStore = useUserStore()

async function GetVerifyCode() {
    await userStore.getVerifyCode()
}
</script>

<template>
    <div class="bg-[var(--el-bg-color)] p-20" border="~ rd-10">
        <div class="m-12 text-center text-24 font-bold">
            <h2>/login/getVerifyCode</h2>
            <span class="font-size-initial font-normal">isLogin:{{ userStore.isLogin }}</span>
            <span class="font-size-initial font-normal">isLogin:{{ userStore.isLogin }}</span>
            <span class="font-size-initial font-normal">isLogin:{{ userStore.isLogin }}</span>
        </div>
        <div class="grid-2">
            <div class="grid-item">
                <el-image :src="userStore.verifyCodeSrc" style="width: 100px; height: 40px;" />
            </div>
            <div class="grid-item">
                <ReButton @click="GetVerifyCode">
                    Get VerifyCode
                </ReButton>
            </div>
        </div>
        <div class="grid-2">
            <div class="grid-item">
                <el-input v-model="userStore.loginForm.userName" placeholder="用户名" />
                <el-input v-model="userStore.loginForm.password" placeholder="密码" />
                <el-switch v-model="userStore.loginForm.remember" :active-icon="h('i', { class: 'i-ep:check' })" :inactive-icon="h('i', { class: 'i-ep:close' })" />
                <el-input v-model="userStore.loginForm.verifyCode" placeholder="验证码" />
            </div>
            <div class="grid-item">
                <ReButton @click="userStore.login">
                    login
                </ReButton>
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
        flex-wrap: wrap;
        background-color: var(--el-color-info-light-9);
    }
}
</style>
