<script lang='ts' setup>
import { computed } from 'vue';
import { CardType } from '@/enums/cardType';
import PlusCircleIcon from './vue-icons/PlusCircleIcon.vue';

const props = withDefaults(defineProps<{
  cardType: CardType
  noCard: boolean
  nome?: string
  descricao?: string
  image?: string
  tipo?: string
}>(), {
  noCard: true
});

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

// em casos de textos longos nos cards escolhidos
function displayInfo(text: string | undefined) {
  return text && text.length > 10 ? 'text-xs' : 'text-base';
}

</script>

<template>
   <div v-if="noCard" :class="['flex flex-col justify-between items-center p-4 border-4 rounded-xl h-[12.5rem] w-[6.5rem]', bgClass]">
    <p class="text-black">{{ props.cardType }}</p>
    <PlusCircleIcon />
  </div>
  <div v-else :class="['flex flex-col justify-between p-4 border-4 rounded-xl h-[12.5rem] w-[7.5rem]', bgClass]">
    <p :class="['text-black', displayInfo(props.nome)]">{{ props.nome }}</p>
    <img :src="props.image" alt="Card Image" class="w-full h-48 object-contain" />
    <p :class="['text-black', displayInfo(props.descricao)]">{{ props.descricao }}</p>
  </div>
</template>

<style scoped lang='scss'>
    
</style>