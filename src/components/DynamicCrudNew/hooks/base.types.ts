export type StringKeyObject = Record<string, any>
/** 获取 T 类型中所有字符串键 */
export type StringKeyOf<T> = Extract<keyof T, string>

/** 移除只读属性 */
export type TypeNoReadonly<T> = {
  -readonly [K in keyof T]: T[K];
}

/** 获取类实例属性的类型并将其变为可选 */
export type InstanceProperty<
  T extends abstract new (...args: any) => any,
  P extends keyof InstanceType<T>, // 实例属性键
> = Partial<TypeNoReadonly<InstanceType<T>[P]>>

/** 定义表单类型 */
export type DefineForm<T> = {
  [K in StringKeyOf<T>]: T[K] | undefined;
}
