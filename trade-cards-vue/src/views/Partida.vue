<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import CardDeck from '@/components/CardDeck.vue';
import BagOfCards from '@/components/BagOfCards.vue';
import { useRoute, useRouter } from 'vue-router';
import { usePartidas } from '../composables/apis/usePartidas';
import { usePartidaEvents } from '@/composables/game/usePartidaEvents';
import { usePlayerStore, showAlert, alertMessage } from '@/state/usePlayerStore';
import HeaderPage from '@/components/HeaderPage.vue';
import { useLocalStorage, useTimestamp } from '@vueuse/core';
import loading from '@/components/loading.vue';
import Alert from '@/components/Alert.vue';
import Tutorial from '@/components/Tutorial.vue';

const route = useRoute();
const router = useRouter();
const store = usePlayerStore();
const { partida, initialize, finishTurn } = usePartidas(store.getMyself);
const cardDeckRef = ref<InstanceType<typeof CardDeck> | null>(null);
const bagOfCards = computed(() => store.bagOfCards);
const isLoading = ref(false);
const isShowTutorial = useLocalStorage('showModal', 0);

// GAME EVENTS
const {
  onLeaveGame,
} = usePartidaEvents();

// Store the start timestamp in localStorage
const storedStart = useLocalStorage('startTimestamp', Date.now());

const isSubscribed = ref(false);

// Initialize useTimestamp to get reactive current time
const timestamp = useTimestamp();

// Store the start timestamp in localStorage if not already set
if (!storedStart.value) {
    storedStart.value = Date.now();
}

async function onClickFinish() {
  isLoading.value = true;
  if(!store.canFinishRound()){
    isLoading.value = false;
    return;
  }
  if(await finishTurn({
    command: store.getCommandPhrase(),
    Jogador: store.getMyself,
    time: Math.floor((timestamp.value - storedStart.value) / 10),
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
  if (!storedStart.value) {
    storedStart.value = Date.now();
  }
  isLoading.value = false;
});

</script>

<template>
  <loading v-show="isLoading" />
  <div class="deck-table w-screen h-screen text-game">
    <Tutorial  v-if="isShowTutorial <= 2"/>
    <HeaderPage :title="`S: ${partida?.id ?? ''}`" @leaveGame="onLeaveGame" />
    <div class="inset-0 flex flex-col items-center justify-between">
      <div class="flex gap-x-1 z-50">
        <BagOfCards :cartas="bagOfCards" @removerCartaEscolhida="(carta) => store.removeOfBagOfCards(carta)" />
      </div>
      <div id="end-square">
        <p>Vazio</p>
      </div>
      <CardDeck ref="cardDeckRef" @usarCarta="(carta) => store.addToBagOfCards(carta)"
        :isSubscribedUpdate="isSubscribed" />
      <div class="flex fixed bottom-2 flex-row justify-between text-[0.6rem]">
        <button @click="store.shuffleDeck"
          class="myButton">
          Reimpilhar
        </button>
        <button @click="onClickFinish"
          class="myButton">
          Finalizar
        </button>
        <button @click="cardDeckRef?.resetLastCard"
          class="myButton">
          Voltar
        </button>
      </div>
      <Alert v-if="showAlert" :title="'Alerta'" :message="alertMessage" @close="showAlert = false" />
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

.myButton {
	box-shadow: 0px 1px 0px 0px #1c1b18;
	background:linear-gradient(to bottom, #eae0c2 5%, #ccc2a6 100%);
	background-color:#eae0c2;
	border-radius:15px;
	border:2px solid #333029;
	display:inline-block;
	cursor:pointer;
	color:#505739;
	font-family:Arial;
	font-size:14px;
	font-weight:bold;
	padding:12px 16px;
	text-decoration:none;
	text-shadow:0px 1px 0px #ffffff;
  margin-left: 0.4rem;
}
.myButton:hover {
	background-color:#b34332;
}
.myButton:active {
	animation: funnyEffect 0.5s;
	position:relative;
	top:1px;
}

@keyframes funnyEffect {
  0% { transform: scale(1); }
  25% { transform: scale(1.1) rotate(10deg); }
  50% { transform: scale(0.9) rotate(-10deg); }
  75% { transform: scale(1.05) rotate(5deg); }
  100% { transform: scale(1) rotate(0deg); }
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