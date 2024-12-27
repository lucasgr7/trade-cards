<script lang='ts' setup>
import {TradingCard } from '@/type';
import Card from './Card.vue';
import { usePlayerStore } from '@/state/usePlayerStore';

const {cartas} = defineProps<{
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
    <h1 class="absolute text-white text-outline ml-[6.6rem]">COMANDO</h1>
    <div class="border-2 border-b-4 border-black p-4 w-[20rem] h-[6rem]
        bg-red-800 text-white 
        mt-2 mb-4 flex flex-wrap gap-2 overflow-y-auto font-mono leading-snug text-[0.9rem]" v-html="store.getCompleteCommandPhrase">
    </div>
    <div class="flex flex-row absolute mt-20">
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
s {
  display: inline;
  line-height: normal;
  margin: 0;
  padding: 0;
}
.text-outline {
  text-shadow: 
    -1px -1px 0 #000,  
     1px -1px 0 #000,
    -1px  1px 0 #000,
     1px  1px 0 #000;
}
</style>