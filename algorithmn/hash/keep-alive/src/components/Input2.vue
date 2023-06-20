<script setup lang="ts">
import { ref } from 'vue'
const msg = ref('input')
defineProps<{ count: number }>()
</script>

<template>
  <h1>{{ msg }}</h1>
  <input type="text" v-model="msg" />
  <p>{{ count }}</p>
</template>

<style scoped></style>