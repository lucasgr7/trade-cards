<script setup lang="ts">
import UserRegister from './views/UserRegister.vue';
import { useSalas } from './composables/useSalas';
import { onMounted } from 'vue';

const {records, getRecords} = useSalas();

onMounted(() => {
  getRecords();
})
</script>

<template>
  <UserRegister />
  <div v-for="record in records" :key="record.id">
    <p>{{ record.id }}</p>
    <p>{{ record.name }}</p>
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
