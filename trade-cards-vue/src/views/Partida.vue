<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import CardDeck from '@/components/CardDeck.vue';
import BagOfCards from '@/components/BagOfCards.vue';
import { useRoute, useRouter } from 'vue-router';
import { usePartidas } from '../composables/apis/usePartidas';
import { usePartidaEvents } from '@/composables/game/usePartidaEvents';
import ShowHand from '@/components/ShowHand.vue';
import { usePlayerStore } from '@/state/usePlayerStore';
import { useChatCompletion } from '@/composables/apis/useChatCompletion';
import CommandPrompt from '@/components/CommandPrompt.vue';
import EnergyBar from '@/components/EnergyBar.vue';

const route = useRoute();
const router = useRouter();
const store = usePlayerStore();
const { partida, initialize, isMyselfAdmin } = usePartidas(store.getMyself);
const cardDeckRef = ref<InstanceType<typeof CardDeck> | null>(null);
const { response, fetchChatCompletion, fetchChatCompletionRankingInstruction, ranking } = useChatCompletion();
const bagOfCards = computed(() => store.bagOfCards);
const totalEnergy = computed(() => store.energyUnits);
const currentEnergy = computed(() => store.currentEnergy);

// LOCAL EVENTS
const responseCommand = ref('');
// GAME EVENTS
const {
  onLeaveGame,
  allCardsSelected,
} = usePartidaEvents();

const isSubscribed = ref(false);

async function onClickGenerateCommand() {
  if(store.currentEnergy === 0) {
    alert('Você não tem energia suficiente para gerar um comando.');
  }

  try {
    await fetchChatCompletion(store.bagOfCards);
    console.log(response.value?.choices[0].message.content);
    responseCommand.value = response.value?.choices[0]?.message?.content ?? '';
    store.removeEnergy(store.deckType);

    // check how percentage of the words in the store.bagOfWords are in the responseCommando
    const percentage = responseCommand.value.split(' ').filter((word: string) => store.bagOfCards.some(card => card.input === word)).length / store.bagOfCards.length;
    console.log('percentage', percentage);
    await fetchChatCompletionRankingInstruction(responseCommand.value, percentage);
  }
  catch (error) {
    console.error(error);
  }
}

onMounted(async () => {
  await initialize(route, router);
  isSubscribed.value = true;
  console.log(store.deck)
});

function accept() {
  responseCommand.value = '';
  store.clearBagOfCards();
  store.addEnergy(store.energyUnits); // restore energy
}

function tryAgain() {
  onClickGenerateCommand();
}

function onCloseModal() {
  responseCommand.value = '';
}

</script>

<template>
  <CommandPrompt :show="responseCommand !== ''" :ranking="ranking" :command="responseCommand"
    @update:show="onCloseModal" @accept="accept" @try-again="tryAgain">
  </CommandPrompt>
  <div class="deck-table w-screen h-screen text-game">
    <div class="flex w-full items-center justify-between">
      <h1 class="text-lg text-white font-black text-outline-blue mt-5 mb-4 pl-8">Trade-Cards {{ partida?.id }}</h1>
      <button @click="onLeaveGame"
        class="absolute top-4 right-0 mb-4 mr-1 text-trade-blue-900 border-2 border-black bg-trade-red-500 p-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
    <div class="fixed inset-0 flex mt-16 flex-col items-center justify-center " v-if="!allCardsSelected">
      <div class="flex gap-x-1 z-50">
        <BagOfCards :cartas="bagOfCards" @removerCartaEscolhida="(carta) => store.removeOfBagOfCards(carta)" />
      </div>
      <div id="end-square">
        <p>Vazio</p>
      </div>
      <EnergyBar :totalEnergy="totalEnergy" :current-energy="currentEnergy"/>
      <CardDeck ref="cardDeckRef" @usarCarta="(carta) => store.addToBagOfCards(carta)"
        :isSubscribedUpdate="isSubscribed" />
      <!-- div center middle tailwindcss -->
      <div class="flex items-center justify-center xl:mt-10">
        <button @click="store.shuffleDeck"
          class="text-xs mt-4 mb-4 text-trade-blue-900 border-2 border-black bg-trade-red-500 p-4">
          Reimpilhar
        </button>
        <button @click="onClickGenerateCommand"
          class="text-xs mt-4 ml-3 mb-4 text-trade-blue-900 border-2 border-black bg-trade-red-500 p-4">
          Gerar Comando
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