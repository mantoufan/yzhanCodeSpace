<template>
  {{ t('hello') }}
  <main-title></main-title>
  <item-card></item-card>
</template>

<script lang="ts" setup>
const { t } = useI18n()
</script>


<route lang="yaml">
meta:
  layout: default
</route>