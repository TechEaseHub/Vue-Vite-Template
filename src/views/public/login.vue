<script setup lang="ts">
import { h } from 'vue'

const loginStore = useLoginStore()
const { getVerifyCode, simulateLogin } = loginStore
const { verifyCodeSrc, loginForm } = storeToRefs(loginStore)
</script>

<template>
  <div class="bg-[var(--el-bg-color)] p-[20px]" border="~ rd-[10px]">
    <el-form @submit.prevent="simulateLogin">
      <div class="grid auto-rows-[40px] grid-cols-6 gap-[12px] bg-[var(--el-color-info-light-9)] p-[20px]">
        <div class="col-span-6 m-auto text-center text-[24px] font-bold">
          <h2>账号密码 登录</h2>
        </div>
        <el-input v-model="loginForm.userName" class="col-span-3" placeholder="用户名" />
        <el-input v-model="loginForm.password" class="col-span-3" placeholder="密码" />

        <el-image class="col-span-3" :src="verifyCodeSrc" fit="contain" />
        <el-input v-model="loginForm.verifyCode" class="col-span-3" placeholder="验证码" />

        <el-switch
          v-model="loginForm.remember"
          class="col-span-2 justify-self-center"
          :active-icon="h('i', { class: 'i-ep:check' })"
          :inactive-icon="h('i', { class: 'i-ep:close' })"
        />
        <ReButton class="col-span-2 justify-self-center" @click="getVerifyCode">
          Get VerifyCode
        </ReButton>
        <ReButton class="col-span-2 justify-self-center" @click="simulateLogin">
          login
        </ReButton>
        <button type="submit" style="display: none;" />
      </div>
    </el-form>
  </div>
</template>

<style scoped lang="scss">

</style>
