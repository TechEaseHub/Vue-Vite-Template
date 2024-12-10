<script setup lang="ts">
import type { CrudProps, DefineForm } from '@/components/DynamicCrud'

import type { Example } from './default'
import { definitions, fields } from './default'

definePage({
  meta: {
    title: 'defalut',
    order: 1,
  },
})

// const expandRowKeys = ref<string[]>([])

const aribitaion: CrudProps<Example> = {
  debug: true,
  url: '/user',
  rowKey: 'id',
  source: { definitions, fields },
  apiEndpoints: {
    add: 'asdasd',
  },
  table: {
    // menuWidth: 400,
  },
  attrs: {
    form: {
      // labelPosition: 'left',
    },
    table: reactive({
    //   'expand-row-keys': computed(() => expandRowKeys.value),
    //   'onExpand-change': (row: Example, expanded: boolean) => {
    //     expandRowKeys.value = []

      //     const { id: taskRecId, parentId } = row

      //     if (expanded)
      //       expandRowKeys.value.push(String(taskRecId))

      //     if (parentId)
      //       expandRowKeys.value.push(String(parentId))
      //   },
      // 'onCell-dblclick': () => { // 覆盖默认方法属性
      //   console.log('onCell-dblclick')
      // },
    }),
  },
  hooks: {
    // beforeQueryHandler: ({ configStore, formStore, tableStore }) => {
    //   console.log(configStore.apiEndpoints)

    //   tableStore.loading = false
    //   console.log(formStore.searchForm)

    //   return false
    // },
  },
}

function asd(a: DefineForm<Example>, b: keyof Example) {
  console.log(a, b)
}
</script>

<template>
  <div class="div-c">
    Default
  </div>
  <DynamicCrud v-bind="aribitaion" @change:search-form="asd">
    <!-- 搜索表单 -->
    <!-- <template #search-form>
      <ElCol :span="24">
        <div>form</div>
      </ElCol>
    </template> -->
    <!-- <template #search-form-top="{ formStore: { searchForm } }">
      <ElCol :span="24">
        <div>{{ searchForm }}</div>
      </ElCol>
    </template> -->
    <!-- <template #search-form-bottom>
      <ElCol :span="24">
        <div>form-top</div>
      </ElCol>
    </template> -->

    <!-- 操作按钮 -->
    <!-- <template #button>
      <div>form-top</div>
    </template> -->
    <!-- <template #button-left>
      <el-button>left</el-button>
    </template> -->
    <!-- <template #button-right>
      <el-button>right</el-button>
    </template> -->

    <!-- 展示表格 -->
    <!-- <template #table-column>
      <el-table-column label="标题">
        <div>内容</div>
      </el-table-column>
    </template> -->
    <!-- <template #menu-top>
      <el-button>menu-top</el-button>
    </template> -->
    <!-- <template #menu-bottom>
      <el-button>menu-bottom</el-button>
    </template> -->
    <!-- <template #menu>
      <div>menu</div>
    </template> -->

    <!-- 编辑表单 -->
    <!-- <template #edit-form>
      <div>form</div>
    </template> -->
    <!-- <template #edit-form-top="{ formStore: { editForm } }">
      <div>{{ editForm }}</div>
    </template> -->
    <!-- <template #edit-form-bottom>
      <div>form-bottom</div>
    </template> -->
  </DynamicCrud>
</template>

<style scoped lang="scss">

</style>
