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
<template>
  <div class="fixed bottom-20 left-1/2 transform -translate-x-1/2 w-[60%]">
    <div class="w-full h-5 bg-black rounded-lg overflow-hidden border-2 border-white">
      <div class="h-full bg-gradient-to-r from-yellow-400 to-yellow-600 transition-width 
      duration-300 ease-in-out" :style="{ width: progressBarWidth }"></div>
    </div>
    <p class="text-white text-center mt-2 text-game text-[0.5rem]">
      Cartas restantes: {{ remainingCards }}/{{ totalCards }}
    </p>
  </div>
</template>

<style scoped>
</style>