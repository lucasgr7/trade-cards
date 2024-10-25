<script lang="ts" setup>
import { ref, computed } from 'vue';
import { useCardSwipe } from '../composables/useCardSwipe';
import Card from './Card.vue';

const props = defineProps<{
  onChoseCard: (title: string) => void;
}>();

// Lista inicial de cartas com IDs únicos e propriedades
const initialCards = [
  { id: 1, image: 'exchange.gif', title: 'Troca', description: '1', type: 'blue'},
  { id: 2, image: 'open-gift.gif', title: 'Revelar', description: '2', type: 'blue' },
  { id: 3, image: 'open-gift.gif', title: 'Revelar', description: '3', type: 'blue' },
  { id: 4, image: 'exchange.gif', title: 'Troca', description: '4', type: 'blue' },
  { id: 5, image: 'exchange.gif', title: 'Troca', description: '5', type: 'blue' },
];
// Estado das cartas (stack)
const cards = ref([...initialCards]);

// Referências das cartas
const currentCardRef = ref(null);
const stackedCardRefs = ref([]);

// Flag para reempilhamento
const isReStacking = ref(false);

// Contador de cartas restantes
const remainingCards = ref(cards.value.length);

// Posições de toque
let touchStartX = 0;
let touchMoveX = 0;

// Computed para obter as duas cartas visíveis
const visibleCards = computed(() => {
  if (cards.value.length === 0) return [];
  const current = cards.value[cards.value.length - 1];
  const next = cards.value.length > 1 ? cards.value[cards.value.length - 2] : null;
  return [current, next];
});

const {
  startSwipe,
  moveSwipe,
  endSwipe,
  recarregarPilha } = useCardSwipe(
    touchStartX,
    touchMoveX,
    currentCardRef,
    cards,
    remainingCards,
    isReStacking,
    stackedCardRefs,
    initialCards);
</script>

<template>
  <div class="card-deck">
    <!-- Re-stack Animation: render all cards stacked vertically when re-stacking -->
    <div v-if="isReStacking">
      <div v-if="cards.length > 0" class="card-container current-card" :class="[cards[cards.length].type]"
        :style="{ zIndex: 2 }" ref="currentCardRef" @touchstart="startSwipe" @touchmove="moveSwipe"
        @touchend="endSwipe">
        <Card :image="cards[cards.length].image" :title="cards[cards.length].title"
          :description="cards[cards.length].description" :type="cards[cards.length].type" />
      </div>
    </div>

    <!-- Render current and next cards when not re-stacking -->
    <div v-else>
      <!-- Carta Próxima (Atrás) -->
      <div v-if="cards.length > 1" class="card-container next-card" :style="{ zIndex: 1 }">
        <Card :image="cards[cards.length - 2].image" :title="cards[cards.length - 2].title"
          :description="cards[cards.length - 2].description" :type="cards[cards.length - 2].type" />
      </div>

      <!-- Carta Atual (Topo) -->
      <div v-if="cards.length > 0" class="card-container current-card"
        :class="[cards[cards.length - 1].type] && [cards[cards.length - 1].id]" :style="{ zIndex: 2 }"
        ref="currentCardRef" @touchstart="startSwipe" @touchmove="moveSwipe" @touchend="endSwipe">
        <Card :image="cards[cards.length - 1].image" :title="cards[cards.length - 1].title"
          :description="cards[cards.length - 1].description" :type="cards[cards.length - 1].type"
          @choseCard="props.onChoseCard" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-deck {
  position: relative;
  width: 300px;
  height: 400px;
  perspective: 1000px;
  overflow: hidden;
  margin: auto;
}

.card-container {
  position: absolute;
  width: 280px;
  /* Reduzido para dar espaçamento */
  height: 380px;
  /* Reduzido para dar espaçamento */
  background-color: #ffffff;
  border-radius: 20px;
  /* Bordas arredondadas */
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  /* Sombra para dar profundidade */
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  color: #333;
  cursor: grab;
  user-select: none;
  touch-action: none;
  /* Evita comportamentos padrões de swipe */
  top: 10px;
  /* Espaçamento superior */
  left: 10px;
  /* Espaçamento lateral */
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
</style>
