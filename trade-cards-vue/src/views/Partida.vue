<script lang="ts" setup>
import { supabase } from '@/util/supabase';
import { onMounted, ref } from 'vue';
import CardDeck from '@/components/CardDeck.vue';
import CardChosen from '@/components/CardChosen.vue';
import { CardType } from '@/enums/cardType';
import { useRoute } from 'vue-router';
import { Partidas, usePartidas } from '@/composables/usePartidas';
import { Deck } from '@/composables/useDeck';
import { useDeckImages } from '@/composables/useImage';


const route = useRoute();
const {getPartidaBySalaId} = usePartidas();
const salaId = ref(0);
const partida = ref<Partidas|null>(null);
const { getImage } = useDeckImages();

// Lista de cartas para o CardDeck
const cartasDeck = ref<Array<any>>([]); // Ajuste o tipo conforme necessário


onMounted( async () => {
  salaId.value = Number(route.params.id);
  partida.value = await getPartidaBySalaId(salaId.value);
  console.log('cartas', partida.value?.cartas_disponiveis)

  if (partida.value) {
    // Converter o deck em uma lista de cartas
    cartasDeck.value = convertDeckToList(partida.value.cartas_disponiveis);

  }

  // supabase
  //   .channel('room1')
  //   .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'partidas' }, payload => {
  //     // Atualizar o deck conforme necessário
  //     const updatedPartida = payload.new as Partidas;
  //     partida.value = updatedPartida;
  //     cartasDeck.value = convertDeckToList(updatedPartida.cartas_disponiveis);

  //   })
  //   .subscribe()
})

// Função para converter o Deck em uma lista de cartas
function convertDeckToList(deck: Deck): Array<any> {
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
    <h1 class="text-4xl font-black text-outline-blue mt-2">Trade-Cards {{ salaId }}</h1>
    <p class="text-blue-900 mt-2">Escolha as cartas do deck para montar uma ação.</p>
    <CardDeck :cards="cartasDeck" :onChoseCard="choseCard" />
     <div class="flex gap-x-2">
      <CardChosen :card-type="CardType.Action"/>
      <CardChosen :card-type="CardType.Object"/>
      <CardChosen :card-type="CardType.Condition"/>
     </div>
  </div>
</template>

<style lang="css">
h1 {
  text-align: center;
}
</style>