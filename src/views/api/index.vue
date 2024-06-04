<script setup lang="ts">
import { User } from '@/api'

const UserApi = new User()
const imageSrc = ref('')
function getVerifyCode() {
    UserApi.getVerifyCode().then((Res) => {
        console.log(Res)
        imageSrc.value = window.URL.createObjectURL(Res)
    })
}

const activeNames = ref([])
</script>

<template>
    <div bg="#fff" border="~ rd-10" w-500 p-20>
        <el-collapse v-model="activeNames" accordion>
            <el-collapse-item v-for="key in 5" :key title="Consistency" :name="key">
                <template #title>
                    <el-link @click.stop="getVerifyCode">
                        Get Users
                    </el-link>
                </template>
                <template #default>
                    <el-image :src="imageSrc" />
                </template>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>

<style scoped lang="scss">

</style>
