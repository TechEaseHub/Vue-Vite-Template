<script setup lang="ts">
import { Params, columns, fields } from './hooks'
import type { Row } from './hooks'

import type { Props } from '@/components/A-Crud'

definePage({
    path: '/example/default',
    meta: {
        title: '默认实现',
        icon: 'i-clarity:dashboard-line',
    },
})

const attribute: Props<Row> = {
    apiConfig: {
        url: '/user',
        rowKey: 'userId',
    },
    source: { fields, columns },
    hooks: {
        beforeQueryHandler: ({ searchForm, formData }) => {
            // 处理多选
            if (Array.isArray(searchForm.hobby))
                formData.value.hobby = searchForm.hobby.join(',')
            if (Array.isArray(searchForm.hobby2))
                formData.value.hobby2 = searchForm.hobby2.join(',')

            return true
        },
    },
}

function searchFormChange(from: Row) {
    const unWatch = watch(() => from.name, (name, prevname) => {
        console.log(name, prevname)
        unWatch()
    })
}

onMounted(() => {
    console.log(Params)
})
</script>

<template>
    <ACrud v-bind="attribute" @search-form-change="searchFormChange" />
</template>

<style scoped lang="scss">

</style>
