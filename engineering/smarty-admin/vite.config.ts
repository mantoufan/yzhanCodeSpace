import { defineConfig } from 'vite'
import path from 'path'
import Vue from '@vitejs/plugin-vue'
import Unocss from 'unocss/vite'
import { presetUno, presetAttributify, presetIcons } from 'unocss'
import UnocssIcons from '@unocss/preset-icons'
import Pages from 'vite-plugin-pages'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import Layouts from 'vite-plugin-vue-layouts'
import VueI18n from '@intlify/unplugin-vue-i18n/vite'

export default defineConfig({
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, 'src')}/`
    }
  },
  plugins: [
    Vue({
      include: [/\.vue$/]
    }),
    Unocss({
      presets: [
        UnocssIcons({
          // options
          prefix: 'i-',
          extraProperties: {
            display: 'inline-block'
          }
        }),
        presetUno(),
        presetAttributify(),
      ]
    }),
    Pages({
      extensions: ['vue'],
      exclude: ['*/components/*.vue']
    }),
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        'pinia',
        'vue-i18n',
        '@vueuse/core',
        '@vueuse/head'
      ],
      dirs: ['src/composables/*.js'],
      vueTemplate: true,
      dts: 'src/auto-imports.d.ts',
    }),
    Components({
      dirs: ['src/components', 'src/pages/*/components'],
      extensions: ['vue'],
      include: [/\.vue$/],
      dts: 'src/components.d.ts',
    }),
    Layouts(),
    VueI18n({
      include: [path.resolve(__dirname, 'locales/**')],
    })
  ]
})