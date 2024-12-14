<script lang='ts' setup>
import { CardTypeV3, TradingCard } from '@/type';
import { computed } from 'vue';
import Card from './Card.vue';
import { usePlayerStore } from '@/state/usePlayerStore';

const props = defineProps<{
  cartas?: TradingCard[]
}>();

const emit = defineEmits(['removerCartaEscolhida']);
const store = usePlayerStore();

const removeCarta = (card: any) => {
  emit('removerCartaEscolhida', card);
};

</script>

<template>
  <div class = "flex flex-col gap-2">
    <div class="border-2 border-b-4 border-black p-4 w-[20rem] h-[6rem] rounded-lg bg-green-200 text-black 
        mt-2 mb-4 flex flex-wrap gap-2 overflow-y-auto flex-shrink font-serif leading-snug text-[0.8rem]" v-html="store.getCompleteCommandPhrase">
    </div>
    <div  class="flex flex-row absolute mt-20" >
      <Card :small="true" v-for="(carta, i) in cartas" :key="i" :card="carta" @click="removeCarta(carta)" />
    </div>  
  </div>
</template>

<style scoped lang='scss'>
.action-card {
  background: linear-gradient(135deg, #61c5ff, #a2d2ff);
}

.object-card {
  background: linear-gradient(135deg, #ffb1a3, #ff6347);
}

.condition-card {
  background: linear-gradient(135deg, #51d85c, #a0ffa0);
}

.connection-card {
  background: linear-gradient(135deg, #f7d154, #f7f754);
}

.color-card {
  background: linear-gradient(135deg, #a35ff7, #d2a2ff);
}

.joker-card {
  background: linear-gradient(135deg, #fcfcfc, #cecece);
}
s{
  // remove all spacing
  margin: 0;
  padding: 0;
  
}
</style>