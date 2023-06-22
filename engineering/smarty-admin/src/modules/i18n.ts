import { createI18n } from 'vue-i18n'
import { UserModule } from './types'
// Vite auto laod locals files into messages
import messages from '@intlify/unplugin-vue-i18n/messages'

export const install: UserModule = ({ app }) => {
  app.use(createI18n({
    locale: 'zh-CN',
    messages
  }))
}