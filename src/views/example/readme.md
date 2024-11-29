### **1. 没有嵌套路径的情况：**

对于直接在根目录下 `src\views` 创建的 Vue 文件，只需按照 `vue-router` 的标准配置 `definePage` 函数就可以了。

---

### **2. 有嵌套目录路径的情况：**

当你有嵌套路径，并且希望自定义父路由属性时，**需要创建一个 `index.vue` 文件**，或者在其他文件中配置 `meta.isMenu: true`。

#### **自定义父路由属性：**
**创建 `index.vue` 文件：**
  如果你希望自定义父路由的属性，最直接的方式是创建一个 `index.vue` 文件，这样该文件就会作为父路由的配置文件。会在路由表中移除当前路由

**使用其他文件名进行配置：**
  如果你不想使用 `index.vue` 作为文件名，你也可以在其他文件中配置父路由属性，需要在 `index.vue` 文件中添加 一个 `path` 值，这样就不会匹配到 `child.path === ''` ，这样配置了 `meta.isMenu: true` 的文件就会作为父路由的配置文件。会在路由表中移除当前路由

**不进行任何配置：**
  如果你没有显式配置父路由属性（比如没有进行以上操作），系统会默认使用第一个子路由的属性作为父路由的属性。
  -  `index.vue`、`meta.isMenu: true` 都没有配置的情况下，会选择第一个子路由的配置添加到父路由中，并且会保留当前路由信息。
  - 假设你没有配置 `index.vue` 或 `meta.isMenu: true` 属性，它会自动从第一个子路由继承 `meta` 属性。关键点是：这种自动继承行为是系统默认的。
  - 需要注意，在 `FilterRoutes` 函数中的 `component` 属性，如果父路径有，会把父路由当作嵌套路由解析，这就需要 `RouterView` 来渲染。

**配置方式：**
无论你使用 `index.vue` 文件，还是其他自定义文件，都需要按照 `vue-router` 的标准方式配置 `definePage` 函数。

#### **配置优先级：**
`index.vue`(未配置path) > `meta.isMenu: true` > 默认使用第一个子路由信息

- 如果文件同时具备 `index.vue` 和 `meta.isMenu: true` 的条件，`index.vue` 会优先作为父路由属性的来源。

---

### **3. 配置嵌套路由：**

如果需要在父路由中使用嵌套的 `RouterView`，可以按照以下方式进行配置：
```vue
<RouterView v-slot="{ Component }">
  <keep-alive :max="2">
    <component :is="Component" />
  </keep-alive>
</RouterView>
```

在 `src\stores\useRouter.ts` 中，需要调整 `FilterRoutes` 函数的解构，避免直接解构 `component` 属性。通过将 `component` 属性移到 `restProps` 中，父路由可以正确携带 `component` 属性，从而实现嵌套路由的解析。

```diff
- const { path, name, component, children: _, ...restProps } = children
+ const { path, name, children: _, ...restProps } = children
```
这样配置后，父路由将正确带上 `component` 属性，并成为嵌套路由的父组件。

---

### **4. 默认父路由配置：**

如果你没有显式配置父路由属性（比如没有进行以上操作），系统会默认使用第一个子路由的属性作为父路由的属性。

**例如：**
假设你没有配置 `index.vue` 或 `meta.isMenu: true` 属性，它会自动从第一个子路由继承 `meta` 属性。关键点是：
这种自动继承行为是系统默认的。
- 需要注意，在 `FilterRoutes` 函数中的 `component` 属性，如果父路径有，会把父路由当作嵌套路由解析，这就需要 `RouterView` 来渲染。

---

### **总结：**
1. **没有嵌套路径：** 直接在根目录下配置即可。
2. **有嵌套路径：** 自定义父路由配置时，创建 `index.vue` 文件或在其他文件中添加 `meta.isMenu: true`。
3. **配置嵌套路由：** 通过 `RouterView` 和调整 `FilterRoutes` 函数来实现父路由的嵌套路由解析。
4. **默认父路由配置：** 如果没有自定义，父路由会从第一个子路由继承属性，需注意解构方式，防止父路由误解析为嵌套路由。
