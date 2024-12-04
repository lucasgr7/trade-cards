<script lang='ts' setup>
import { useDeck } from '@/composables/game/useDeck';
import { DeckGameType } from '@/type';
import { useRoute, useRouter } from 'vue-router';
import { usePlayerStore } from '@/state/usePlayerStore';
import * as _ from 'lodash';
import HeaderPage from '@/components/HeaderPage.vue';

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
  <div class="flex flex-col items-center justify-between p-4 text-game
    border border-white rounded-xl bg-trade-blue-100 w-screen h-screen">
    <HeaderPage title="Escolha seu baralho" @leaveGame="leave"/>
    <!-- decks -->
    <div id="deck-sun" class="px-10 text-[0.5rem] flex flex-col items-center">
      <div class="h-[210px] w-[110px] mb-2 float shine" @click="selectDeck(DeckGameType.Sun)">
        <img src="@/assets/baralho-sol.png" alt="Baralho-Sol">
      </div>
      <div class="flex justify-between pt-1 pb-8">
        <div class="flex items-center border border-black rounded-full px-4 bg-yellow-300">
          <img src="@/assets/icons/energy.png" class="h-8 w-8 pr-2 border-0 border-r-2 border-black" alt="Energia">
          <p class="text-black ml-4">{{ SUN_DECK.ENERGY }}</p>
        </div>
        <div class="flex items-center border border-black rounded-full px-4 bg-blue-300">
          <img src="@/assets/icons/joker.png" class="h-8 w-8 pr-2 border-0 border-r-2 border-black" alt="Coringas">
          <p class="text-black ml-4">{{ SUN_DECK.JOKERS }}</p>
        </div>
      </div>
    </div>
    <div id="deck-moon" class="border-0 border-t-2 px-10 pt-12 border-black text-[0.5rem] flex flex-col items-center">
      <div class="h-[210px] w-[110px] mb-2 float shine" @click="selectDeck(DeckGameType.Moon)">
        <img src="@/assets/baralho-lua.png" alt="Baralho-Lua">
      </div>
      <div class="flex justify-between pt-2">
        <div class="flex items-center border border-black rounded-full px-4 bg-yellow-300">
          <img src="@/assets/icons/energy.png" class="h-8 w-8 pr-2 border-0 border-r-2 border-black" alt="Energia">
          <p class="text-black ml-4">{{ MOON_DECK.ENERGY }}</p>
        </div>
        <div class="flex items-center border border-black rounded-full px-4 bg-blue-300">
          <img src="@/assets/icons/joker.png" class="h-8 w-8 pr-2 border-0 border-r-2 border-black" alt="Coringas">
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
  height: 70%;
  background: linear-gradient(120deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.4) 50%, rgba(255, 255, 255, 0) 100%);
  animation: shine 2s infinite;
}

@keyframes shine {
  to {
    left: 125%;
  }
}
</style>