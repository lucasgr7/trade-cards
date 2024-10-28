<script lang="ts" setup>
import { supabase } from '@/util/supabase';
import { computed, onMounted, ref } from 'vue';
import CardDeck from '@/components/CardDeck.vue';
import CardChosen from '@/components/CardChosen.vue';
import { CardType } from '@/enums/cardType';
import { useRoute, useRouter } from 'vue-router';
import { usePartidas } from '../composables/usePartidas';
import { useDeckImages } from '@/composables/useImage';
import { Exceptions } from '@/util/enum.exceptions';
import { usePlayer } from '@/composables/usePlayer';
import { Partidas } from 'type';


const route = useRoute();
const router = useRouter();
const { getMyself} = usePlayer();
const {partida, initialize} = usePartidas(getMyself);
const { getImage } = useDeckImages();

// Lista de cartas para o CardDeck
const cartasDeck = computed(() => {
  if(!partida?.value){
    return [];
  }
  if(partida.value.cartas_disponiveis){
    return convertDeckToList(partida.value.cartas_disponiveis);
  }else{
    return [];
  }
}); // Ajuste o tipo conforme necessário


onMounted( async () => {
  try{
    if(!route.params.id){
      // router push lasst page
      router.push({name: 'Home'})  
    }
    await initialize(Number(route.params.id));
  }
  catch(error: any)
  {
    if(error.message === Exceptions.MATCH_INVALID_ID){
      router.push({name: 'Home'})
    }
    else if(error.message === Exceptions.PARTIDA_NOT_FOUND){
      router.push({name: 'Home'})
    }
  }
})

// Função para converter o Deck em uma lista de cartas
function convertDeckToList(deck: Record<string, { descricao: string; tipo: CardType; count: number }>): Array<any> {
  const lista: Array<any> = [];
  let count = 1;
  for (const [cardName, cardInfo] of Object.entries(deck)) {
    for (let i = 0; i < cardInfo.count; i++) {
      lista.push({
        nome: cardName,
        descricao: cardInfo.descricao,
        tipo: cardInfo.tipo,
        image: getImage(cardName),
        id: count
        // Adicione outras propriedades necessárias aqui
      });
      count++;
    }
  }
  // shuffle
  lista.sort(() => Math.random() - 0.5);

  return lista;
}

// TODO: Implementar a função choseCard
function choseCard(title: string) {
 alert(`Card chosen: ${title}`);
}

</script>
<template>
  <div class="flex flex-col items-center justify-between p-4
    border border-white rounded-xl bg-trade-blue-50
    w-screen h-screen">
    <h1 class="text-4xl font-black text-outline-blue mt-2">Trade-Cards {{ partida?.sala_id }}</h1>
    <p class="text-blue-900 mt-2">Escolha as cartas do deck para montar uma ação.</p>
    <div class="flex gap-x-2">
      <CardChosen :card-type="CardType.Action"/>
      <CardChosen :card-type="CardType.Object"/>
      <CardChosen :card-type="CardType.Condition"/>
     </div>
    <CardDeck :cards="cartasDeck" :onChoseCard="choseCard" />
  </div>
</template>

<style lang="css">
h1 {
  text-align: center;
}
</style>