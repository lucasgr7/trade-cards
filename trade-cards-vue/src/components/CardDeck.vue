<!-- src/components/CardDeck.vue -->
<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue';
import Card from './Card.vue';
import ProgressBar from './ProgressBar.vue';
import { useCardSwipe } from '@/composables/utils/useCardSwipe';
import { usePlayerCardTracker } from '@/composables/game/usePlayerCardTracker';
import { Cartas } from 'type';
import { Howl } from 'howler'; // Library for handling sounds

const { activeCardsTracking, resetDeck } = usePlayerCardTracker();
const cardsInHand = ref<Cartas[]>([]);
const cardRefs = ref<HTMLElement[]>([]);
const previousTopCardId = ref<number | undefined>(undefined);
const cardUsedByPlayer = ref(false); // Flag to indicate if the local player used the card

// multiple sound effects
const soundEffect = new Howl({
  src: ['/mp3/card-sounds-35956.mp3'],
  preload: true,
  volume: 0.25
});

// Contador de cartas restantes
const remainingCards = computed(() => cardsInHand.value.length);
const totalCards = ref(0);

const topCardIndex = computed(() => cardsInHand.value.length - 1);

// Touch event handlers
const { startSwipe, moveSwipe, endSwipe, removeCard } = useCardSwipe(
  cardRefs,
  cardsInHand,
  topCardIndex,
  handleUsarCarta
);

// Function to compute style for each card
function getCardStyle(index: number) {
  const offset = (cardsInHand.value.length - index - 1) * 3.75; // Adjust offset as needed
  return {
    zIndex: index,
    transform: `translate(-50%, -${offset}px)`,
  };
}

// Function to set refs for each card
function setCardRef(el: HTMLElement | null, index: number) {
  if (el) {
    cardRefs.value[index] = el;
  }
}


// Touch events for the top card
const touchEvents = {
  touchstart: startSwipe,
  touchmove: moveSwipe,
  touchend: endSwipe,
};
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
    // Get the IDs of the old and new top cards
    const oldTopCardId = previousTopCardId.value;
    const newTopCard = currentActiveCards[currentActiveCards.length - 1];
    const newTopCardId = newTopCard?.id;

    if(!oldTopCardId) {
      return;
    }
    if (currentActiveCards.length !== cardsInHand.value.length) {
      cardsInHand.value = [...currentActiveCards];
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
  { immediate: true}
);
// Função para emitir o evento com a carta atual
const emit = defineEmits(['usarCarta', 'totalCartas']);

function handleUsarCarta() {
  const currentCard = cardsInHand.value[cardsInHand.value.length - 1];
  cardUsedByPlayer.value = true;
  if (currentCard) {
    emit('usarCarta', currentCard);
  }
  // previousTopCardId.value = currentCard.id;
  playCardSwipeSoundEffect();
}

// Expose the functions and variables


defineExpose({
  handleUsarCarta,
  removeCard,
  resetDeck
});

onMounted(async () => {
  cardsInHand.value = [];
  cardsInHand.value = [...activeCardsTracking.value];
  previousTopCardId.value = activeCardsTracking.value[activeCardsTracking.value.length - 1]?.id;
  totalCards.value = activeCardsTracking.value.length;
});

</script>

<template>
  <div class="card-deck">
    <!-- Render all cards in the stack -->
    <div
      v-for="(card, index) in cardsInHand"
      :key="card.id"
      class="card-container"
      :class="{ 'current-card': index === topCardIndex }"
      :style="getCardStyle(index)"
      :ref="el => setCardRef(el, index)"
      v-on="index === topCardIndex ? touchEvents : {}"
    >
      <Card
        :image="card.image ?? ''"
        :title="card.nome"
        :description="card.descricao"
        :type="card.tipo"
        :id="card.id"
        :isBottomCard="index === 0"
      />
    </div>
    <ProgressBar :remainingCards="remainingCards" :totalCards="totalCards" />
  </div>
</template>

<style scoped>
.card-deck {
  position: relative;
  width: 210px;
  height: 300px;
  margin: auto;
}

.card-container {
  position: absolute;
  transform: translateX(-50%);
  transition: transform 0.2s ease, top 0.2s ease;
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
  max-width: 180px;
  height: 280px;
  border-radius: 20px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  margin: 0;
}

@media screen and (min-height: 667px) {
  .card-deck {
    height: 200px;
  }
  .card-container {
    margin-left: 6.8rem;
  }
}

@media screen and (min-height: 1080px) {
  .card-container {
    margin-left: 6.5rem;
  }
}

</style>
