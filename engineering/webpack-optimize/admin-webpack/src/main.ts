import App from '@/App.vue'
import { createApp } from 'vue'
import router from '@/router'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import '@/style.css'
createApp(App).use(router).use(createPinia()).use(createI18n({
  legacy: false,
  locale: 'en'
})).mount('#app')