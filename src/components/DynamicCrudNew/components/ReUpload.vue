<script setup lang="ts">
const props = withDefaults(defineProps<{
  buttonName?: string
  listType?: 'text' | 'picture' | 'picture-card'
  limit?: number
  imgSrc?: string
}>(), {
  buttonName: '选择文件',
  listType: 'text',
  limit: 1,
})
</script>

<template>
  <div>
    上传文件:{{ props.buttonName }}
  </div>
</template>
