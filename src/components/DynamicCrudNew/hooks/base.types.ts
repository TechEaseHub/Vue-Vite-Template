/** 移除只读属性 */
export type TypeNoReadonly<T> = {
  -readonly [K in keyof T]: T[K];
}

/** 获取类实例属性的类型并将其变为可选 */
export type InstancePropertyType<
  T extends abstract new (...args: any) => any,
  P extends keyof InstanceType<T>, // 实例属性键
> = Partial<TypeNoReadonly<InstanceType<T>[P]>>
