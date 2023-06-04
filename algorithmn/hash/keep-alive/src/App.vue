<script setup lang="ts">
import Input from './components/Input.vue'
import { ref } from 'vue'
const count = ref(1)
</script>

<template>
  <button type="button" @click="count++">count is {{ count }}</button>

  <my-keep-alive>
    <component :is="Input" v-if="count % 2" :count="count" />
  </my-keep-alive>
</template>

<style scoped></style>
