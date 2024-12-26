<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue';
import Card from './Card.vue';
import ProgressBar from './ProgressBar.vue';
import { useCardSwipe } from '@/composables/utils/useCardSwipe';
import { TradingCard} from '@/type';
import { Howl } from 'howler'; // Library for handling sounds
import { usePlayerStore } from '@/state/usePlayerStore';
import * as _ from 'lodash';

const store = usePlayerStore();
const cardsInHand = ref<TradingCard[]>([]);
const cardRefs = ref<HTMLElement[]>([]);

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
const { startSwipe, moveSwipe, endSwipe, resetLastCard } = useCardSwipe(
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

function playCardSwipeSoundEffect() {
  soundEffect.play();
}

// Função para emitir o evento com a carta atual
const emit = defineEmits(['usarCarta', 'totalCartas']);

function handleUsarCarta() {
  const currentCard = cardsInHand.value[cardsInHand.value.length - 1];
  if (currentCard) {
    emit('usarCarta', currentCard);
  }
  // previousTopCardId.value = currentCard.id;
  playCardSwipeSoundEffect();
}

// Expose the functions and variables
defineExpose({
  handleUsarCarta,
  resetLastCard
});

const reset = () => {
  cardsInHand.value = _.cloneDeep(store.getDeck);
  totalCards.value = store.deck.length;
}

watch(() => store.signalResetDeck, (signal: boolean) => {
  console.log(signal);
  reset();
});

onMounted(async () => {
  cardsInHand.value = [];
  reset();
});

const visibleCardsCount = ref(5); // Number of cards to render at a time

</script>

<template>
  <div class="card-deck">
    <!-- Render only a limited number of cards in the stack -->
    <div v-for="(card, index) in cardsInHand" :key="index" class="card-container"
      :class="{ 'current-card': index === topCardIndex }" :style="getCardStyle(index)"
      :ref="el => setCardRef(el as HTMLElement, index)" v-show="index >= topCardIndex - visibleCardsCount && index <= topCardIndex"
      v-on="index === topCardIndex ? touchEvents : {}">
      <Card :card="card" :isBottomCard="index === 0" />
    </div>
    <ProgressBar :remainingCards="remainingCards" :totalCards="totalCards" />
  </div>
</template>

<style scoped>
.card-deck {
  position: fixed;
  height: 15rem;
  margin-top: 12rem;
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

@media screen and (min-height: 568px) {
  .card-deck {
    width: 210px;
  }

  .card-container {
    margin-left: 6.5rem;
  }
}

@media screen and (min-height: 667px) {
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
