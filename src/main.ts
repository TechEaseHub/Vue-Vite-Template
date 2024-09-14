import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'

import App from './App.vue'
import { router } from './router'

import '@/styles/index.scss'
import '@unocss/reset/tailwind.css'
import 'uno.css'

const app = createApp(App)
// 配置 pinia 持久化
const pinia = createPinia()
pinia.use(
    createPersistedState({
        key: id => `${import.meta.env.VITE_NAMESPACE}__${id}`,
    }),
)
app.use(router)
app.use(pinia)

app.mount('#app')
