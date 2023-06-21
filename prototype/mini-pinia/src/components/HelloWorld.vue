<script setup>
import { useCounterStore } from '../store/counter-diy';

// import { ref } from 'vue'

// defineProps({
//   msg: String,
// })

// const count = ref(0)

const counter = useCounterStore()
</script>

<template>
  <h1>{{ counter.count }} - {{ counter.doubleCounter }}</h1>
  <button type="button" @click="counter.count++">counter.count++</button>
  <button type="button" @click="counter.increment()">counter.increment()</button>
  <button type="button" @click="counter.$patch({ count: counter.count + 1 })">counter.$patch({count: counter.count +
    1})</button>
  <button type="button" @click="counter.$patch(state => state.count++)">counter.$patch(state => state.count++)</button>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
