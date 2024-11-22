<script lang="ts" setup>
import { computed, defineProps } from 'vue';

const props = defineProps<{
  remainingCards: number;
  totalCards: number;
}>();

const progressBarWidth = computed(() => {
  const percentage = (props.remainingCards / props.totalCards) * 100;
  return `${percentage}%`;
});
</script>
<!-- ProgressBar.vue -->
<template>
  <div class="fixed bottom-24 left-1/2 transform -translate-x-1/2 w-3/4">
    <div class="w-full h-5 bg-yellow-900 rounded-lg overflow-hidden border-2 border-white">
      <div class="h-full bg-gradient-to-r from-yellow-700 to-yellow-500 transition-width duration-300 ease-in-out" :style="{ width: progressBarWidth }"></div>
    </div>
    <p class="text-white text-center mt-2">
      Cartas restantes: {{ remainingCards }}/{{ totalCards }}
    </p>
  </div>
</template>

<style scoped>
</style>