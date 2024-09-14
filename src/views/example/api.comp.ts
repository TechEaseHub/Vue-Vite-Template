type PrimitiveType = 'string' | 'number' | 'boolean' | 'object' | 'undefined' | 'function' | 'symbol' | 'bigint'
type Validator<T> = (value: T) => { valid: boolean, error?: string }

// 使用 ES 原生方法判断是否为对象
function isObject(value: any): boolean {
    return value !== null && (typeof value === 'object' || typeof value === 'function')
}

export function createValidator<T>(schema: { [K in keyof T]: PrimitiveType[] }): Validator<T> {
    return (obj: T) => {
        if (!isObject(obj))
            return { valid: false, error: 'params 应为 object 类型' }

        for (const key in schema) {
            if (Object.hasOwn(schema, key)) {
                const types = schema[key]
                const value = obj[key]

                if (value === undefined) {
                    if (types.includes('undefined'))
                        continue
                    return { valid: false, error: `参数 "${key}" 的值为 undefined ，但未包含在允许的类型中` }
                }

                const isValidType = types.includes(typeof value)

                if (!isValidType)
                    return { valid: false, error: `参数 "${key}" 的类型应为 ${types.join(' 或 ')} ，但接收到的类型为 ${typeof value}` }
            }
        }

        return { valid: true }
    }
}
