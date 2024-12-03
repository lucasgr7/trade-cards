<script lang='ts' setup>
import { useDeck } from '@/composables/game/useDeck';
import { DeckGameType } from '@/type';
import { useRoute, useRouter } from 'vue-router';
import { usePlayerStore } from '@/state/usePlayerStore';
import * as _ from 'lodash';

const router = useRouter();
const route = useRoute();
const store = usePlayerStore();
const { generateDeck } = useDeck();
const INITIAL_ENERGY = 15;
const SUN_DECK = {
  ENERGY: 5,
  JOKERS: 2,
}

const MOON_DECK = {
  ENERGY: 3,
  JOKERS: 5,
}

function leave() {
  router.push('/');
}

function selectDeck(deckType: DeckGameType) {
  const roomId = Number(route.params.id ?? 0);
  store.deck = generateDeck(deckType)
  store.setTotalEnergyUnits(INITIAL_ENERGY);
  router.push(`/create-joker-card/${roomId}/${deckType}`);
}

</script>

<template>
  <div class="flex flex-col items-center justify-between p-4
    border border-white rounded-xl bg-trade-blue-100
    w-screen h-screen">
    <div class="flex w-full items-center ">
      <button @click="leave"
        class="absolute top-4 right-0 mb-4 mr-1 text-trade-blue-900 border-2 border-black bg-trade-red-500 p-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <h1 class="text-3xl font-black text-outline-blue mb-8 ml-4">Escolha seu baralho</h1>
    </div>
    <!-- decks -->
    <div id="deck-sun" class="px-16">
      <div class="h-[300px] w-[210px] mb-2 float shine" @click="selectDeck(DeckGameType.Sun)">
        <img src="@/assets/baralho-sol.png" alt="Baralho-Sol">
      </div>
      <div class="flex justify-between pt-1 pb-8">
        <div class="flex items-center border border-black rounded-full px-4 bg-yellow-300">
          <img src="@/assets/icons/energy.png" class="h-10 w-10 pr-2 border-0 border-r-2 border-black" alt="Energia">
          <p class="text-black ml-4">{{ SUN_DECK.ENERGY }}</p>
        </div>
        <div class="flex items-center border border-black rounded-full px-4 bg-blue-300">
          <img src="@/assets/icons/joker.png" class="h-10 w-10 pr-2 border-0 border-r-2 border-black" alt="Coringas">
          <p class="text-black ml-4">{{ SUN_DECK.JOKERS }}</p>
        </div>
      </div>
    </div>
    <div id="deck-moon" class="border-0 border-t-2 px-16 pt-12 border-black">
      <div class="h-[300px] w-[210px] mb-2 float shine" @click="selectDeck(DeckGameType.Moon)">
        <img src="@/assets/baralho-lua.png" alt="Baralho-Lua">
      </div>
      <div class="flex justify-between pt-2 pb-2">
        <div class="flex items-center border border-black rounded-full px-4 bg-yellow-300">
          <img src="@/assets/icons/energy.png" class="h-10 w-10 pr-2 border-0 border-r-2 border-black" alt="Energia">
          <p class="text-black ml-4">{{ MOON_DECK.ENERGY }}</p>
        </div>
        <div class="flex items-center border border-black rounded-full px-4 bg-blue-300">
          <img src="@/assets/icons/joker.png" class="h-10 w-10 pr-2 border-0 border-r-2 border-black" alt="Coringas">
          <p class="text-black ml-4">{{ MOON_DECK.JOKERS }}</p>
        </div>
      </div>
    </div>
    <!-- END DECK -->
  </div>
</template>

<style scoped lang='scss'>
/* Animação de flutuação */
.float {
  animation: float 3s ease-in-out infinite;
}

@keyframes float {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-20px);
  }
}

/* Efeito de brilho */
.shine {
  position: relative;
  overflow: hidden;
}

.shine::after {
  content: '';
  position: absolute;
  top: 0;
  left: -75%;
  width: 50%;
  height: 100%;
  background: linear-gradient(120deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.4) 50%, rgba(255, 255, 255, 0) 100%);
  animation: shine 2s infinite;
}

@keyframes shine {
  to {
    left: 125%;
  }
}
</style>