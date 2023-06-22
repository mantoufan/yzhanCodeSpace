<template lang="">
  <div @click="toggleLocales">切换语言，当前：{{ t('language')}}</div>
</template>
<script setup lang="ts">
const { t, availableLocales, locale } = useI18n()
const toggleLocales = () => {
  const locales = availableLocales
  locale.value = locales[(locales.indexOf(locale.value) + 1) % locales.length]
}
</script>