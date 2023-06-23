<template lang="">
  <!-- <div> -->
    <!-- <h1>{{ msg }}</h1> -->
    <!-- <button @click="user.add(1)">{{ user.count }}</button> -->
    <router-view />
  <!-- </div> -->
</template>
<script setup lang="ts">
import { ref, Ref } from 'vue'
import { useUserStore } from '@/stores/user'
const user = useUserStore()
// const msg: Ref<number> = ref(0)
// setInterval(() => {
//   msg.value++
// }, 1000)
</script>
<style scoped lang="scss"></style>