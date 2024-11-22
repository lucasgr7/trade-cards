<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import CardDeck from '@/components/CardDeck.vue';
import CardChosen from '@/components/CardChosen.vue';
import { CardType } from '@/enums/cardType';
import { useRoute, useRouter } from 'vue-router';
import { usePartidas } from '../composables/apis/usePartidas';
import { usePlayer } from '@/composables/state/usePlayer';
import { usePartidaEvents } from '@/composables/game/usePartidaEvents';
import ShowHand from '@/components/ShowHand.vue';
import { StatusMatch } from '@/enums/statusMatch';
import { Partidas } from '@/type';
import { PartidaAcoes } from '@/enums/partidas.actions';

const route = useRoute();
const router = useRouter();
const { getMyself } = usePlayer();
const { partida, initialize, subscribeToChanges, isMyselfAdmin } = usePartidas(getMyself);
const cardDeckRef = ref<InstanceType<typeof CardDeck> | null>(null);

// GAME EVENTS
const {
  onLeaveGame,
  onPlayCard,
  allCardsSelected,
  selectedActionCard,
  selectedConditionCard,
  selectedObjectCard,
  clearSelectedCards

} = usePartidaEvents();
const cardPiles = [
  { type: CardType.Action, card: selectedActionCard },
  { type: CardType.Object, card: selectedObjectCard },
  { type: CardType.Condition, card: selectedConditionCard }
];
const isSubscribed = ref(false);

onMounted(async () => {
  await initialize(route, router);
  isSubscribed.value = true;
  checkUsedCards();
});

subscribeToChanges(Number(route.params.id), (payload: Partidas) => {
  isSubscribed.value = true;
  const lastAction = payload.acoes[payload.acoes.length - 1];
  if (lastAction?.acao === PartidaAcoes.resetDeck) {
    clearSelectedCards();
  }
});

function checkUsedCards() {
  if (partida.value?.estado === StatusMatch.INITSTATUS) {
    resetCardPiles();
  } else {
    cardPiles.forEach((pile, index) => {
      if (pile.card.value) {
        cardPiles[index].card = pile.card;
      }
    });
  }
}

function resetCardPiles() {
  cardPiles.forEach((pile) => {
    pile.card.value = null;
  });
}

function refresh() {
  cardDeckRef.value?.resetDeck();
}

</script>
<template>
  <div class="deck-table
    w-screen h-screen">
    <div class="flex w-full items-center justify-between">
      <h1 class="text-3xl font-black text-outline-blue mt-4 mb-4 pl-8">Trade-Cards {{ partida?.id }}</h1>
      <button @click="onLeaveGame"
        class="absolute top-4 right-0 mb-4 mr-1 text-trade-blue-900 border-2 border-black bg-trade-red-500 p-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
    <div class="fixed inset-0 flex mt-16 flex-col items-center justify-center " 
      v-if="!allCardsSelected">
      <div class="flex gap-x-1">
        <CardChosen v-for="(pile, index) in cardPiles" :key="index" :cardType="pile.type" :noCard="!pile.card.value"
          :nome="pile.card?.value?.nome" :descricao="pile.card?.value?.descricao" :image="pile.card?.value?.image"
          :tipo="pile.card?.value?.tipo" class="w-[6.8rem] md:w-1/2 lg:w-1/5 xl:w-1/3" />
      </div>
      <div id="end-square">
        <p>Vazio</p>
      </div>
      <CardDeck ref="cardDeckRef" @usarCarta="onPlayCard" :isSubscribedUpdate="isSubscribed" />
      <!-- div center middle tailwindcss -->
       <div class="flex items-center justify-center xl:mt-10">
        <button @click="refresh" class="mt-4 mb-4 text-trade-blue-900 border-2 border-black bg-trade-red-500 p-2">
          Reimpilhar
        </button>
        <button @click="onLeaveGame"
          class="mt-4 ml-3 mb-4 text-trade-blue-900 border-2 border-black bg-trade-red-500 p-2">
          Sair
        </button>
      </div>
    </div>
    <ShowHand :is-myself-admin="isMyselfAdmin" v-else />
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
  width: 202px;
  height: 292px;
  border: 4px solid white;
  border-radius: 20px;

  font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;

  /* Centralizar o quadrado dentro do #deck-table */
  position: absolute;
  top: 62%;
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