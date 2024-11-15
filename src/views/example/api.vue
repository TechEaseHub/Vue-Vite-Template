<script setup lang="ts">
import { h } from 'vue'

const loginStore = useLoginStore()
const { getVerifyCode, login } = loginStore
const { verifyCodeSrc, loginForm } = storeToRefs(loginStore)

definePage({
  path: '/example/api',
  meta: {
    title: 'API 接口',
    icon: 'i-ant-design:api-twotone',
    order: -90,
  },
})

const url = ref('')
const options = ref<{ label: string, value: string }[]>([{ label: '', value: '' }])
function fetchData() {
  // 使用 reduce 将数组转换为对象
  const obj = options.value.reduce((acc, { label, value }) => {
    acc[label] = value
    return acc
  }, {} as Record<string, string>)
  console.log(obj)

  Http.RetryPOST(url.value, obj).then((Res) => {
    console.log(Res)
  })
}
</script>

<template>
  <div class="bg-[var(--el-bg-color)] p-[20px]" border="~ rd-[10px]">
    <el-form @submit.prevent="login">
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
        <ReButton class="col-span-2 justify-self-center" @click="login">
          login
        </ReButton>
        <button type="submit" style="display: none;" />
      </div>
    </el-form>

    <div class="bg-[var(--el-color-info-light-9)] p-[20px]">
      <div class="grid grid-cols-6 gap-[12px]">
        <div class="col-span-6 m-auto text-center text-[24px] font-bold">
          <h2>自定义请求</h2>
        </div>
        <el-input v-model="url" class="col-span-4" placeholder="url地址" />
        <div class="col-span-2 justify-self-center">
          <el-button type="primary" @click="() => options.push({ label: '', value: '' })">
            添加参数
          </el-button>
          <el-button type="success" @click="fetchData">
            发起请求
          </el-button>
        </div>
      </div>

      <div v-for="(opt, idx) in options" :key="idx" class="grid grid-cols-6 my-[6px]">
        <div class="col-span-2">
          <el-input v-model="opt.label" class="col-span-2" placeholder="属性名" />
        </div>
        <div class="col-span-2">
          <el-input v-model="opt.value" class="col-span-2" placeholder="属性值" />
        </div>
        <div class="col-span-2 justify-self-center">
          <el-button type="danger" @click="() => options.splice(idx, 1)">
            <i class="i-ep:delete" />
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
