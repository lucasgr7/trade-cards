<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import CardDeck from '@/components/CardDeck.vue';
import BagOfCards from '@/components/BagOfCards.vue';
import { useRoute, useRouter } from 'vue-router';
import { usePartidas } from '../composables/apis/usePartidas';
import { usePartidaEvents } from '@/composables/game/usePartidaEvents';
import { usePlayerStore } from '@/state/usePlayerStore';
import HeaderPage from '@/components/HeaderPage.vue';
import { useTimestamp } from '@vueuse/core';
import loading from '@/components/Loading.vue';

const route = useRoute();
const router = useRouter();
const store = usePlayerStore();
const { partida, initialize, finishTurn } = usePartidas(store.getMyself);
const cardDeckRef = ref<InstanceType<typeof CardDeck> | null>(null);
const bagOfCards = computed(() => store.bagOfCards);
const isLoading = ref(false);

// GAME EVENTS
const {
  onLeaveGame,
} = usePartidaEvents();

// initialize a timer, vueuse or lodash
const timestamp = useTimestamp({ offset: 0 })
const start = timestamp.value

const isSubscribed = ref(false);

async function onClickFinish() {
  isLoading.value = true;
  if(await finishTurn({
    command: store.getCommandPhrase(),
    Jogador: store.getMyself,
    time: timeSpent.value,
    weight: store.currentHandWeight,
  })){
    // display command phrase
    router.push({ name: 'ShowCommand' });
  }
  isLoading.value = false;
}

onMounted(async () => {
  isLoading.value = true;
  await initialize(route, router);
  isSubscribed.value = true;
  store.shuffleDeck();
  if(partida.value?.rodada_atual !== store.currentRodada){
    store.setCurrentRodada(partida.value!.rodada_atual);
  }
  isLoading.value = false;
});

const timeSpent = computed(() => {
  return timestamp.value - start
})



</script>

<template>
  <loading v-show="isLoading" />
  <div class="deck-table w-screen h-screen text-game">
    <HeaderPage :title="`Trade-Cards ${partida?.id ?? ''}`" @leaveGame="onLeaveGame" />
    <div class="inset-0 flex flex-col items-center justify-between">
      <div class="flex gap-x-1 z-50">
        <BagOfCards :cartas="bagOfCards" @removerCartaEscolhida="(carta) => store.removeOfBagOfCards(carta)" />
      </div>
      <div id="end-square">
        <p>Vazio</p>
      </div>
      <CardDeck ref="cardDeckRef" @usarCarta="(carta) => store.addToBagOfCards(carta)"
        
        :isSubscribedUpdate="isSubscribed" />
      <div class="flex fixed bottom-0 items-center justify-center xl:mt-10 text-[0.6rem]">
        <button @click="store.shuffleDeck"
          class="mt-4 mb-4 text-trade-blue-900 border-2 border-black bg-trade-red-500 p-4">
          Reimpilhar
        </button>
        <button @click="onClickFinish"
          class="mt-4 ml-3 mb-4 text-trade-blue-900 border-2 border-black bg-trade-red-500 p-4">
          Finalizar
        </button>
        <button @click="cardDeckRef?.resetLastCard"
          class="mt-4 ml-3 mb-4 text-trade-blue-900 border-2 border-black bg-trade-red-500 p-4">
          Voltar
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="css">
h1 {
  text-align: center;
}

.deck-table {

  /* Fundo verde com um gradiente sutil para dar profundidade */

  touch-action: none;
  /* Textura simulada usando uma imagem padrão (opcional) */
  background: radial-gradient(circle, #006400, #2e8b57);
  border-radius: 15px;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.5);

  /* Bordas arredondadas para simular a mesa */
  border-radius: 15px;

  /* Sombra interna para dar um efeito de profundidade */
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.5);
}

/* Estilos para o quadrado branco */
#end-square {
  width: 150px;
  height: 200px;
  border: 4px solid white;
  border-radius: 20px;

  font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;

  /* Centralizar o quadrado dentro do #deck-table */
  position: absolute;
  top: 55%;
  left: 45%;
  transform: translate(-50%, -50%);

  /* Bordas arredondadas e sombra para destaque */
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);

  display: block;
  opacity: 1;
  transition: opacity 0.5s ease-in-out;
}

/* Estilo para o texto dentro do quadrado */
#end-square p {
  margin: 0;
  padding: 0;
  text-align: center;
  font-size: 26px;
  color: white;
  line-height: 100px;
  /* Centraliza verticalmente o texto */
}

/* Ajustes para telas menores */
@media (max-width: 600px) {
  #deck-table {
    height: 80vh;
    border-radius: 10px;
  }
}

/* Ajustes para telas Tablet */
@media (max-width: 912px) {
  #end-square {
    left: 50%;
  }
}

/* Ajustes para telas grandes */
@media (min-width: 1200px) {
  #end-square {
    left: 50%;
  }
}
</style>