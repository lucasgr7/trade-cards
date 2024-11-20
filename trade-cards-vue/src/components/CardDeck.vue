<!-- src/components/CardDeck.vue -->
<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue';
import Card from './Card.vue';
import { useCardSwipe } from '@/composables/useCardSwipe';
import { usePartidas } from '@/composables/usePartidas';
import { useRoute, useRouter } from 'vue-router';
import { usePlayerCardTracker } from '@/composables/useCardsInGame';
import { usePlayer } from '@/composables/usePlayer';
import { Cartas } from 'type';
import { Howl } from 'howler'; // Library for handling sounds

const { activeCardsTracking } = usePlayerCardTracker();
const { getMyself } = usePlayer();
const { partida, initialize } = usePartidas(getMyself);
const route = useRoute();
const router = useRouter();
const cardsInHand = ref<Array<Cartas>>([]);
const previousTopCardId = ref<number | undefined>(undefined);
const cardUsedByPlayer = ref(false); // Flag to indicate if the local player used the card
// multiple sound effects
const soundEffect = new Howl({
  src: ['/mp3/card-sounds-35956.mp3'],
  preload: true
});

// Referências das cartas
const currentCardRef = ref<HTMLElement | null>(null);
const stackedCardRefs = ref<Array<HTMLElement | null>>([]);
// Contador de cartas restantes
const remainingCards = ref(cardsInHand.value.length);

// Flag para reempilhamento
const isReStacking = ref(false);

// Importar e utilizar composable de swipe (presumivelmente)
const { startSwipe, moveSwipe, endSwipe, recarregarPilha, removeCard } = useCardSwipe(
  currentCardRef,
  cardsInHand,
  remainingCards,
  isReStacking,
  stackedCardRefs,
  [],
  handleUsarCarta,
  handleUserDicardCard
);

// Function to play the funny sound effect
function playFunnySoundEffect() {
  soundEffect.play();
}

function playCardSwipeSoundEffect(){
  soundEffect.play();
}

// update cards do servidor
watch(
  activeCardsTracking,
  (currentActiveCards: Cartas[]) => {
    // Update the remaining cards count
    remainingCards.value = currentActiveCards.length;
    // Get the IDs of the old and new top cards
    const oldTopCardId = previousTopCardId.value;
    const newTopCard = currentActiveCards[currentActiveCards.length - 1];
    const newTopCardId = newTopCard?.id;

    if(!oldTopCardId) {
      return;
    }

    // Check if the top card has changed
    if (oldTopCardId !== newTopCardId) {
      if (cardUsedByPlayer.value) {
        // The local player used the card
        cardUsedByPlayer.value = false; // Reset the flag
      } else {
        // TODO: O sistem ainda não está identificando quando usuário usa uma carta
        // The card was used by another player
        console.log('Card was used by another player');
        playFunnySoundEffect();
      }
    }

    // Update the cardsInHand
    cardsInHand.value = [...currentActiveCards];

    // Update previousTopCardId for next comparison
    previousTopCardId.value = newTopCardId;
  },
  { immediate: true, deep: true }
);
// Função para emitir o evento com a carta atual
const emit = defineEmits(['usarCarta']);

function handleUsarCarta() {
  const currentCard = cardsInHand.value[cardsInHand.value.length - 1];
  cardUsedByPlayer.value = true;
  if (currentCard) {
    emit('usarCarta', currentCard);
  }
  previousTopCardId.value = currentCard.id;
  playCardSwipeSoundEffect();
}

function handleUserDicardCard() {
  const currentCard = cardsInHand.value[cardsInHand.value.length - 1];
  previousTopCardId.value = currentCard.id;
  playCardSwipeSoundEffect();
}

const visibleTopCard = computed(() => {
  return cardsInHand.value[cardsInHand.value.length - 1];
})

defineExpose({
  handleUsarCarta,
  removeCard
});

onMounted(async () => {
  await initialize(route, router);
  cardsInHand.value = [...activeCardsTracking.value];
  previousTopCardId.value = activeCardsTracking.value[activeCardsTracking.value.length - 1]?.id;
});

</script>

<template>
  <div class="card-deck">
    <!-- Re-stack Animation: render all cards stacked vertically when re-stacking -->
    <div v-if="isReStacking">
      <div v-if="cardsInHand.length > 0" class="card-container current-card" :class="[cardsInHand[cardsInHand.length - 1].tipo]"
        :style="{ zIndex: 2 }" ref="currentCardRef" @touchstart.passive="startSwipe" @touchmove.passive="moveSwipe"
        @touchend="endSwipe">
        <Card 
          :image="cardsInHand[cardsInHand.length - 1].image ?? ''" 
          :title="cardsInHand[cardsInHand.length - 1].nome"
          :description="cardsInHand[cardsInHand.length - 1].descricao" 
          :type="cardsInHand[cardsInHand.length - 1].tipo"
          :id="cardsInHand[cardsInHand.length - 1].id"
           />
      </div>
    </div>

    <!-- Render current and next cards when not re-stacking -->
    <div v-else>
      <!-- Carta Próxima (Atrás) -->
      <div v-if="cardsInHand.length > 1" class="card-container next-card" :style="{ zIndex: 2 }">
        <Card 
          :image="cardsInHand[cardsInHand.length - 2].image ?? ''" 
          :title="cardsInHand[cardsInHand.length - 2].nome"
          :description="cardsInHand[cardsInHand.length - 2].descricao" 
          :type="cardsInHand[cardsInHand.length - 2].tipo"
          :id="cardsInHand[cardsInHand.length - 1].id" />
      </div>

      <!-- Carta Atual (Topo) -->
      <div v-if="cardsInHand.length > 0" class="card-container current-card"
        :class="[cardsInHand[cardsInHand.length - 1].tipo]" :style="{ zIndex: 2 }"
        ref="currentCardRef" @touchstart.passive="startSwipe" @touchmove.passive="moveSwipe" @touchend="endSwipe">
        <Card 
          :image="cardsInHand[cardsInHand.length - 1].image ?? ''" 
          :title="cardsInHand[cardsInHand.length - 1].nome"
          :description="cardsInHand[cardsInHand.length - 1].descricao" 
          :type="cardsInHand[cardsInHand.length - 1].tipo"
          :id="cardsInHand[cardsInHand.length - 1].id"/>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-deck {
  position: relative;
  width: 100%;
  height: 100%;
  perspective: 1000px;
  overflow: hidden;
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
}

.card-container {
  position: absolute;
  width: 210px;
  height: 300px;
  margin-left: 16%;
  margin-top: 20%;
  /* align center elements in postiion absolute */
  background-color: #ffffff;
  border-radius: 20px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  color: #333;
  cursor: grab;
  user-select: none;
  touch-action: none;
  top: 10px;
  left: 10px;
}

/* Carta atual com maior z-index */
.current-card {
  z-index: 2;
}

/* Carta próxima com menor z-index */
.next-card {
  z-index: 1;
}

/* Cartas durante a reempilhamento */
.stacked-card {
  top: 0;
  left: 0;
  width: 280px;
  height: 380px;
  border-radius: 20px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  margin: 0;
}

@media screen and (min-height: 667px) {
  .card-container {
    margin-left: 4.5rem;
  }
}

@media screen and (min-height: 812px) {
  .card-container {
    margin-left: 5.5rem;
  }
}

@media screen and (min-height: 1080px) {
  .card-container {
    margin-left: 18rem;
  }
}
</style>
