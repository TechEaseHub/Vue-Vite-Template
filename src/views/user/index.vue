<script setup lang="ts">
import { Params, columns, fields } from './hooks'
import type { UserInfo } from './hooks'

import type { Props } from '@/components/A-Crud'

definePage({
    path: '/user',
    meta: {
        title: '用户管理',
        icon: 'i-clarity:dashboard-line',
        order: 1,
    },
})

const attribute: Props<UserInfo> = {
    apiConfig: {
        url: '/user',
        rowKey: 'userId',
    },
    source: { fields, columns },
    attrs: {
        form: { showMessage: true },
    },
    hooks: {
        beforeEditHandler: ({ currentRow }) => {
            const orgIdProps = columns.orgId?.componentProps
            if (orgIdProps) {
                const { orgId: value, orgName: label } = currentRow.value
                orgIdProps.options = [{ value, label }]
            }
            return true
        },
    },
}

onMounted(() => {
    console.log(Params)
})
</script>

<template>
    <ACrud v-bind="attribute" />
</template>

<style scoped lang="scss">

</style>
