<script setup lang="ts">
import type { BaseRow, ColumnsType, Fields } from './hooks'
import { componentMap } from './hooks'

interface MyRow extends BaseRow {
  age: number
}

const definitions: ColumnsType<MyRow> = {
  // id: {
  //   type: 'input',
  //   label: 'ID',
  //   searchDefaultValue: 1,
  //   componentProps: {
  //     disabled: false,
  //     onInput: (value: string) => {
  //       console.log(value)
  //     },
  //     // options: [
  //     //   { label: '30', value: 30 },
  //     //   { label: '25', value: 25 },
  //     // ],
  //   },
  // },
  name: {
    type: 'orgSelect',
    label: 'Name',
    componentSlot: {
      // 在默认插槽中，使用 v-for 循环 options 数组，生成 el-option 组件
      // Start of Selection
      default: () => {
        const options = [
          { label: '30', value: 30 },
          { label: '25', value: 25 },
        ]
        return options.map(option => h(ElOption, option))
      },
    },
  },
  age: {
    type: 'select',
    label: 'Age',
    searchDefaultValue: 30,
    componentProps: {
      // disabled: false,
      // onInput: (value: string) => {
      //   console.log(value)
      // },
      options: [
        { label: '30', value: 30 },
        { label: '25', value: 25 },
      ],
    },
  },
}

const fields: Fields<keyof typeof definitions> = {
  filter: ['id', 'name', 'age'],
  editor: ['id', 'name', 'age'],
  expand: ['id', 'name', 'age'],
  column: ['id', 'name', 'age'],
}

const form = reactive<MyRow>({
  id: 1,
  name: 'John Doe',
  age: 30,
})

function EForm(props: { title: string }, context: any) {
  // 1. 标题部分
  const header = h('h1', `DynamicCrudNew ${props.title}`)

  // 使用 computed 来追踪 form 的变化
  const formInfoText = computed(() => `form: ${JSON.stringify(form)}`)

  // 2. 表单信息和按钮部分
  const formInfo = h('div', formInfoText.value)

  console.log(1231, context)

  // 5. 根 div，将所有部分组合在一起
  return h('div', [header, formInfo])
}

// const EForm = defineComponent({
//   name: 'EForm',
//   props: {
//     title: {
//       type: String,
//       required: true,
//     },
//   },
//   setup(props, context) {
//     // 1. 标题部分
//     const header = h('h1', `DynamicCrudNew ${props.title}`)

//     // 2. 表单信息和按钮部分
//     const formInfo = h('div', `form: ${JSON.stringify(form)}`)

//     console.log(1231, context)

//     // 5. 根 div，将所有部分组合在一起
//     return () => h('div', [header, formInfo])
//   },
// })
</script>

<template>
  <div>
    <div>
      <EForm title="123" />
    </div>
    <ElForm :model="form">
      <ElFormItem
        v-for="item in fields.filter"
        :key="item"
        :label="definitions[item]?.label"
      >
        <component
          :is="componentMap[definitions[item].type]"
          v-if="definitions[item]"
          v-model="form[item]"
          v-bind="definitions[item].componentProps"
        >
          <template v-for="(slotFunc, name) in definitions[item].componentSlot || {}" #[name]="slotData">
            <component :is="slotFunc" v-if="slotFunc" :key="name" />
            <slot v-else :name="name" v-bind="slotData" />
          </template>
        </component>
      </ElFormItem>
    </ElForm>
  </div>
</template>

<style scoped lang="scss">

</style>
