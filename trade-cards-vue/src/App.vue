<script setup lang="ts">
import { useSalas } from './composables/useSalas';
import { onMounted } from 'vue';

const {records, getRecords} = useSalas();

onMounted(() => {
  getRecords();
})
</script>

<template>
  <main>
    <RouterView />
  </main>
</template>

<style scoped>
</style>
