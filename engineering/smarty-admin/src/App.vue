<script setup lang="ts">
// import { ref } from 'vue'
// const num = ref(0)
// const add = () => {
//   num.value++
// }
// import { useUserStore } from '~/stores/user'
// const userStore = useUserStore()
</script>

<template>
  <!-- <button @click="userStore.add(1)">num is: {{ userStore.count }}</button>
  <button py="2"
    class="px-4 font-semibold rounded-lg shadow-md text-white bg-green-500 hover:bg-green-700 border-none cursor-pointer">
    <i class="i-carbon-logo-github p-3"></i>Uno
    Available</button> -->
  <router-view></router-view>
</template>