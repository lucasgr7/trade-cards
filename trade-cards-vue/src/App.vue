<script setup lang="ts">
import { useSalas } from './composables/apis/useSalas';
import { onMounted } from 'vue';

const { getRecords} = useSalas();

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
