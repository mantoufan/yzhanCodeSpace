import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true, // jest like 语法
    environment: 'happy-dom' // 模拟 dom 环境
  }
})
