<script setup lang="ts">
import { h } from 'vue'

import TUXINAGCAIJI, { type RequestParams } from './api.comp.vue'

const userStore = useUserStore()

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

    // Http.RetryPOST(url.value, JSON.parse(data.value)).then((Res) => {
    //     console.log(Res)
    // })
}

const TUX_Drawer = ref(false)
const TUX_DrawerParams = ref<RequestParams>()
function openTUXDrawer(key: number) {
    TUX_Drawer.value = true
    TUX_DrawerParams.value = { id: key + Math.random() }
}
</script>

<template>
    <div class="bg-[var(--el-bg-color)] p-20" border="~ rd-10">
        <div class="grid grid-cols-2 gap-12">
            <div class="grid auto-rows-[40px] grid-cols-6 gap-12 bg-[var(--el-color-info-light-9)] p-[20px]">
                <div class="col-span-6 m-auto text-center text-24 font-bold">
                    <h2>账号密码 登录</h2>
                </div>

                <el-input class="col-span-3" v-model="userStore.loginForm.userName" placeholder="用户名" />
                <el-input class="col-span-3" v-model="userStore.loginForm.password" placeholder="密码" />

                <el-image class="col-span-3" :src="userStore.verifyCodeSrc" fit="contain" />
                <el-input class="col-span-3" v-model="userStore.loginForm.verifyCode" placeholder="验证码" />

                <el-switch
                    class="col-span-2 justify-self-center"
                    v-model="userStore.loginForm.remember"
                    :active-icon="h('i', { class: 'i-ep:check' })"
                    :inactive-icon="h('i', { class: 'i-ep:close' })"
                />
                <ReButton class="col-span-2 justify-self-center" @click="userStore.getVerifyCode">
                    Get VerifyCode
                </ReButton>
                <ReButton class="col-span-2 justify-self-center" @click="userStore.login">
                    login
                </ReButton>
            </div>

            <div class="bg-[var(--el-color-info-light-9)] p-[20px]">
                <div class="grid grid-cols-6 gap-12">
                    <div class="col-span-6 m-auto text-center text-24 font-bold">
                        <h2>自定义请求</h2>
                    </div>
                    <el-input class="col-span-4" v-model="url" placeholder="url地址" />
                    <div class="col-span-2 justify-self-center">
                        <el-button type="primary" @click="() => options.push({ label: '', value: '' })">
                            添加参数
                        </el-button>
                        <el-button type="success" @click="fetchData">
                            发起请求
                        </el-button>
                    </div>
                </div>

                <div class="grid grid-cols-6 my-6" v-for="(opt, idx) in options" :key="idx">
                    <div class="col-span-2">
                        <el-input class="col-span-2" v-model="opt.label" placeholder="属性名" />
                    </div>
                    <div class="col-span-2">
                        <el-input class="col-span-2" v-model="opt.value" placeholder="属性值" />
                    </div>
                    <div class="col-span-2 justify-self-center">
                        <el-button type="danger" @click="() => options.splice(idx, 1)">
                            <i class="i-ep:delete" />
                        </el-button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="my-12">
        <el-button @click="openTUXDrawer(1)">
            打开抽屉: {{ TUX_Drawer }}
        </el-button>
    </div>

    <TUXINAGCAIJI v-model="TUX_Drawer" :params="TUX_DrawerParams" />
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
