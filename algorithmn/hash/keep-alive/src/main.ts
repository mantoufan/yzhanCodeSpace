import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { MyKeepAlive } from './components/MyKeepAlive.ts'

const app = createApp(App)
app.component('my-keep-alive', MyKeepAlive)
app.mount('#app')

