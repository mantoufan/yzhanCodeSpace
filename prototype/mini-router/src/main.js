import { createApp } from 'vue'
import App from './App.vue'
import router from './mini-router'

import './assets/main.css'

const app = createApp(App).use(router).mount('#app')
