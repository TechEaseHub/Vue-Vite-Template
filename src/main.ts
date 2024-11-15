import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'
import { createApp } from 'vue'

import App from './App.vue'
import { router } from './router'

import '@unocss/reset/tailwind.css'
import 'uno.css'

import '@/styles/index.scss'

const app = createApp(App)

const pinia = createPinia()
pinia.use(
  createPersistedState({
    key: id => `${import.meta.env.VITE_NAMESPACE}__${id}`,
  }),
)
app.use(router)
app.use(pinia)

app.mount('#app')
