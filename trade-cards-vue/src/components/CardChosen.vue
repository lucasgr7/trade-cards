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
    return 'card blue-card';
  } else if (props.cardType === CardType.Object) {
    return 'card red-card';
  } else if (props.cardType === CardType.Condition) {
    return 'card green-card';
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
    <p :class="['text-black text-center', displayInfo(props.nome)]">{{ props.nome }}</p>
    <img :src="props.image" alt="Card Image" class="w-full h-48 object-contain" />
    <p :class="['text-black text-center', displayInfo(props.descricao)]">{{ props.descricao }}</p>
  </div>
</template>

<style scoped lang='scss'>

/* Estilos para cartas azuis */
.card.blue-card {
  border: 4px solid #fafafa;
  background: linear-gradient(135deg, #61c5ff, #537ea6);
}

.card.blue-card::before {
  background: radial-gradient(circle at center, rgba(97,197,255,0.4), transparent);
}

/* Estilos para cartas vermelhas */
.card.red-card {
  border: 4px solid #fafafa;
  background: linear-gradient(135deg, #ffb1a3, #ff6347);
}

.card.red-card::before {
  background: radial-gradient(circle at center, rgba(255,177,163,0.4), transparent);
}

/* Estilos para cartas verdes */
.card.green-card {
  border: 4px solid #fafafa;
  background: linear-gradient(135deg, #178520, #a0ffa0);
}

.card.green-card::before {
  background: radial-gradient(circle at center, rgba(23,133,32,0.4), transparent);
}
</style>