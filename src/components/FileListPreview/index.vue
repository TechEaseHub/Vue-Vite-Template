<script setup lang="ts">
// 接收从父组件传来的文件 URL 列表
defineProps<{ fileUrls: string[] }>()

// 文件扩展名与具体缩略图的映射
const fileTypeMap: Record<string, string> = {
    // 图片类型缩略图
    png: 'i-mdi:file-image-outline',
    jpg: 'i-mdi:file-image-outline',
    jpeg: 'i-mdi:file-image-outline',
    gif: 'i-mdi:file-image-outline',

    // 视频类型缩略图
    mp4: 'i-mdi:file-video',
    webm: 'i-mdi:file-video',
    ogg: 'i-mdi:file-video',

    // 文档类型细分
    pdf: 'i-mdi:file-pdf-outline',
    docx: 'i-mdi:file-word',
    txt: 'i-mdi:file-document-outline',

    // 音频类型缩略图
    mp3: 'i-mdi:file-music-outline',
    wav: 'i-mdi:file-music-outline',

    // 未知类型
    unknown: 'i-mdi:file-question-outline',
}

// 获取文件扩展名
function getFileExtension(fileUrl: string): string {
    return fileUrl.split('.').pop()?.toLowerCase() || ''
}

// 获取文件类型对应的图标
function getFileIcon(fileUrl: string): string {
    const ext = getFileExtension(fileUrl)

    // 直接根据扩展名返回对应的图标
    return fileTypeMap[ext] || fileTypeMap.unknown
}

// 优化后的获取文件名函数
function getFileName(fileUrl: string, maxLength: number = 20): string {
    // 从URL中提取文件名
    const fileName = fileUrl.split('/').pop() || ''

    // 如果文件名长度小于等于最大长度，直接返回
    if (fileName.length <= maxLength)
        return fileName

    // 获取文件扩展名
    const ext = fileName.split('.').pop()

    // 去掉扩展名的文件名部分
    const nameWithoutExt = fileName.slice(0, -(ext?.length ? ext.length + 1 : 0))

    // 计算省略部分的长度，保留文件名前后部分，并插入省略号
    const partLength = Math.floor((maxLength - 3) / 2) // 两部分的长度，减去3个字符的省略号
    const truncatedName = `${nameWithoutExt.slice(0, partLength)}...${nameWithoutExt.slice(-partLength)}`

    // 返回省略后的文件名，拼接扩展名
    return ext ? `${truncatedName}.${ext}` : truncatedName
}
</script>

<template>
    <div class="flex flex-col gap-10">
        <div v-for="(fileUrl, index) in fileUrls" :key="index" class="flex items-center justify-between border rounded-[4px] p-10">
            <el-image v-if="getFileIcon(fileUrl) === 'i-mdi:file-image-outline'" class="h-[50px] w-[50px] object-contain" :src="fileUrl" lazy :preview-src-list="fileUrls" :initial-index="index" />
            <el-icon v-else color="#409eff" :size="32">
                <i :class="getFileIcon(fileUrl)" />
            </el-icon>
            <div class="ml-[10px] flex-1">
                {{ getFileName(fileUrl) }}
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">

</style>
