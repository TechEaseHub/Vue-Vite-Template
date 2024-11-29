<script setup lang="ts">
import type { CrudProps } from '@/components/EasyCrud/hooks/useConfig.types'
import { definitions, fields, type UserInfo } from './crud-default'

definePage({
  meta: {
    title: 'Crud 默认',
    order: -2,
  },
})

const aribitaion: CrudProps<UserInfo> = {
  debug: true,
  url: '/user',
  rowKey: 'userId',
  apiEndpoints: {
    deleteFlag: 'delete',
  },
  source: { definitions, fields },
  hooks: {
    submitValidateErr: ({ fields, formStore }) => {
      console.log({ fields, formStore })

      return false
    },
  },
}
</script>

<template>
  <div class="div-c">
    Default
  </div>
  <EasyCrud v-bind="aribitaion" />
</template>

<style scoped lang="scss">

</style>
