<script lang='ts' setup>
import { computed } from 'vue';
import { CardType } from '@/enums/cardType';
import PlusCircleIcon from './vue-icons/PlusCircleIcon.vue';

const props = defineProps<{
  cardType: CardType
}>()

const bgClass = computed(() => {
  if (props.cardType === CardType.Action) {
    return 'bg-trade-blue-200';
  } else if (props.cardType === CardType.Object) {
    return 'bg-trade-red-300';
  } else if (props.cardType === CardType.Condition) {
    return 'bg-trade-green-300';
  } else {
    return 'bg-white';
  }
});
</script>

<template>
   <div :class="['flex flex-col justify-between p-4 border-4 rounded-xl h-[12.5rem] w-[7.5rem]', bgClass]">
    <p class="text-black">{{ props.cardType }}</p>
    <PlusCircleIcon />
  </div>
</template>

<style scoped lang='scss'>
    
</style>