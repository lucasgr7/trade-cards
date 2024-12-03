<script lang='ts' setup>
import { defineProps, computed } from 'vue';

const props = defineProps<{
  totalEnergy: number;
  currentEnergy: number;
}>();

const energyUnits = computed(() => {
  return Array.from({ length: props.totalEnergy }, (_, index) => index < props.currentEnergy).reverse();
});
</script>

<template>
  <div class="absolute left-2 bottom-44">
    <div class="w-6 h-2 bg-white ml-7 border-4 border-white">
    </div>
    <div class="w-20 bg-white rounded-lg p-2 border-4 border-black text-black flex flex-col justify-end">
      <div v-for="(unit, index) in energyUnits" :key="index" class="h-4 w-full mb-1 rounded-sm" :class="{'bg-trade-green-400': unit, 'bg-gray-300': !unit}"></div>
    </div>
  </div>
</template>

<style scoped lang='scss'>
</style>