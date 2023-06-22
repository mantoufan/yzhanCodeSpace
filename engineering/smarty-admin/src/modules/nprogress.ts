import NProgress from 'nprogress'
import type { UserModule } from './types'

export const install: UserModule = ({ router, isClient }) => {
  if (isClient) {
    NProgress.inc(0.1)
    NProgress.configure({
      easing: 'ease',
      speed: 1000,
      showSpinner: false
    })
    router.beforeEach(() => {
      NProgress.start()
    })
    router.afterEach(() => {
      NProgress.done()
    })
  }
}
