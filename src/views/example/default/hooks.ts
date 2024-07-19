import { CommonProps, ReCheckboxGroup, ReRadioGroup, ReSelect } from '@/components/A-Crud'
import type { BaseRow, ColumnsType, Fields } from '@/components/A-Crud'

import { systemParamsStore } from '@/stores/systemParams'
import type { KeysOf, MapValueType, ResultType } from '@/stores/systemParams'

interface Row extends BaseRow {
    /** 记录id */
    id: number
    /** 日期 */
    date: string
    /** 姓名 */
    name: string
    /** 年龄 */
    age: number
    /** 性别 */
    sex: number
    /** 爱好 */
    hobby: string | string[]
    /** 爱好 */
    hobby2: string | string[]
    /** 地址 */
    address: string
}

const { operatorName, deleteFlag, createTime, updateTime } = CommonProps<Row>()

const columns: ColumnsType<Row> = {
    selection: {
        type: markRaw({}),
        label: '可选框',
        tableProps: { type: 'selection', width: '50', selectable: row => row.id !== 5 },
    },
    index: {
        type: markRaw({}),
        label: '序号',
        tableProps: { type: 'index', width: '55', align: 'right' },
        render: ({ $index, crudOptions }) => {
            const { TableStore: { page: { currentPage, pageSize } } } = crudOptions
            const indexMethod = computed(() => (currentPage.value - 1) * pageSize.value + 1)
            return h('span', null, indexMethod.value + $index)
        },
    },
    id: {
        type: markRaw(ElInputNumber), // 表单中的组件类型(支持自定义组件)
        label: 'ID', // 表单中显示的label

        // disabled: mode => mode === '新增',   // 新增模式下禁用
        // disabled: mode => mode === '编辑',   // 新增模式下禁用
        // disabled: () => true,                // 新增/编辑 模式下禁用
        // visible: mode => mode === '新增',    // 新增模式下显示
        // visible: mode => mode === '编辑',    // 编辑模式下显示
        // searchDefaultValue: 1, // 搜索表单中的默认值
        // addDefaultValue: 2, // 新增表单中的默认值
        formProps: {
            label: 'IDDDD', // 全部生效
            search: {}, // 指定为 搜索表单生效
            edit: {}, // 指定为 新增/编辑表单生效
        },
        componentProps: {
            min: 1,
            max: 100,
            search: {
                controlsPosition: 'right',
            },
        },
        tableProps: {
            minWidth: 90,
            align: 'center',
            // prop: 'sex',
            // sortable: true,
            resizable: false,
            // headerAlign: 'right',
            // className: 'bg-red-500! hover:bg-red-100!',
            // labelClassName: 'text-red-900 hover:text-red-500!',
        },
        render: ({ row }) => h(ElTag, null, () => `序号：${row.id}`), // 表格中自定义渲染模板
    },
    name: {
        type: markRaw(ElInput),
        label: '姓名',
        formProps: {
            rules: [{ min: 3, max: 5, message: '长度应为3到5', trigger: 'blur' }],
            edit: {
                rules: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
            },
        },
        componentProps: {
            // formatter: (value: string | number) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
            // parser: (value: string) => value.replace(/\$\s?|(,*)/g, ''),
            // showPassword: true,
            // suffixIcon: h(ElIcon, { }, { default: () => [h('i', { class: 'i-ep:clock' })] }),
            // TODO：暂时不支持插槽
            // slots: {
            //     prefix: () => h(ElIcon, { class: 'text-red-500' }, { default: () => [h('i', { class: 'i-ep:clock' })] }),
            //     suffix: () => h(ElIcon, { class: 'text-red-500' }, { default: () => [h('i', { class: 'i-ep:clock' })] }),
            // },
            maxlength: 20,
            showWordLimit: true,
        },
    },
    age: {
        type: markRaw(ElInputNumber),
        label: '年龄',
        span: 12,
        componentProps: { showInput: true, min: 18, max: 70, step: 1 },
    },
    sex: {
        type: markRaw(ReRadioGroup),
        label: '性别',
        disabled: Mode => Mode === '编辑',
        componentProps: { options: [], isButton: true },
    },
    hobby: {
        type: markRaw(ReSelect),
        label: '爱好',
        componentProps: {
            options: [
                { value: 1, label: 'Option1' },
                { value: 2, label: 'Option2' },
                { value: 3, label: 'Option3' },
                { value: 4, label: 'Option4' },
                { value: 5, label: 'Option5' },
            ],
            placeholder: '请选择爱好',
            // multiple: true, // 开启多选后，默认值就变成数组了
            filterable: true,
            // remote: true,
            // remoteMethod: (query: string) => {
            //     console.log(query)
            // },
            allowCreate: true,
        },
    },
    hobby2: {
        type: markRaw(ReCheckboxGroup),
        label: '爱好',
        span: 12,
        componentProps: {
            options: [
                { value: 1, label: 'Option1' },
                { value: 2, label: 'Option2' },
                { value: 3, label: 'Option3' },
                { value: 4, label: 'Option4' },
                { value: 5, label: 'Option5' },
            ],
            min: 1,
            max: 3,
            search: { isButton: true },
        },
    },
    date: {
        type: markRaw(ElDatePicker),
        label: '日期',
        formProps: {
            label: 'xx日期',
            rules: [{ required: false, message: '请输入日期', trigger: 'blur' }],
            edit: {
                required: true,
            },
        },
        componentProps: {
            type: 'month',
            // format: 'YYYY-MM',
            valueFormat: 'YYYY-MM',
            prefixIcon: h(ElIcon, {}, { default: () => [h('i', { class: 'i-ep:mic' })] }),
            edit: {
                type: 'daterange',
            },
        },
        // render: ({ row }) => h('span', null, `${row.date}+XX`),
    },
    address: {
        type: markRaw(ElInput),
        label: '地址',
    },
    deleteFlag,
    operatorName,
    createTime,
    updateTime,
}

const fields: Fields<Row> = {
    filter: ['name', 'age', 'sex', 'date', 'address', 'deleteFlag'],
    editor: ['id', 'name', 'age', 'sex', 'hobby', 'hobby2', 'date', 'address', 'deleteFlag'],
    column: ['id', 'name', 'age', 'sex', 'hobby', 'date', 'address', 'deleteFlag'],
    expand: Object.keys(columns) as (keyof Row)[],
}

// TODO: 虽然键是一样的，但是获取数据时处理 value、label、disabled 等属性的方式可能不一样
// TODO：在缓存与取缓存时，需要根据当前键值对应的处理方式来处理
const ParamsMap = new Map<KeysOf<Row>, MapValueType>([
    ['deleteFlag', { key: 'delete_flag' }],
    // 如：disabled处理方式，在这里所有都可用，但是在其他地方可能是值为1时禁用
    ['sex', { key: 'sex', value: item => item.itemId, label: item => item.itemValue, disabled: () => false }],
])
const Params: Partial<Record<KeysOf<Row>, ResultType[]>> = reactive({})

systemParamsStore().GetSystemParams(ParamsMap).then((Res) => {
    Res.forEach((value, key) => {
        Params[key] = value
        if (columns[key]?.componentProps && columns[key].componentProps?.options)
            columns[key].componentProps.options = value
        else
            console.warn(`columns 中 ${key} 未找到 componentProps.options 配置`)
    })
})

export { columns, fields, Params }
export type{ Row }
