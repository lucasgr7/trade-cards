<!-- src/components/CardDeck.vue -->
<script lang="ts" setup>
import { ref, computed, watch } from 'vue';
import Card from './Card.vue';
import { useCardSwipe } from '@/composables/useCardSwipe';
import { Cartas } from '@/composables/usePartidas';

// Define as props recebidas
const props = defineProps<{
  cards: Array<Cartas>;
  onChoseCard: (title: string) => void;
}>();

// Estado das cartas (stack)
const cards = ref([...props.cards]);

// Watch para atualizar as cartas quando a prop muda
watch(() => props.cards, (newCards) => {
  cards.value = [...newCards];
});

// Referências das cartas
const currentCardRef = ref<HTMLElement | null>(null);
const stackedCardRefs = ref<Array<HTMLElement | null>>([]);

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

// Importar e utilizar composable de swipe (presumivelmente)
const { startSwipe, moveSwipe, endSwipe, recarregarPilha } = useCardSwipe(
  touchStartX,
  touchMoveX,
  currentCardRef,
  cards,
  remainingCards,
  isReStacking,
  stackedCardRefs,
  []
);

// Watch para atualizar as cartas quando a prop muda
watch(() => props.cards, (newCards) => {
  cards.value = [...newCards];
});
</script>

<template>
  <div class="card-deck">
    <!-- Re-stack Animation: render all cards stacked vertically when re-stacking -->
    <div v-if="isReStacking">
      <div v-if="cards.length > 0" class="card-container current-card" :class="[cards[cards.length - 1].tipo]"
        :style="{ zIndex: 2 }" ref="currentCardRef" @touchstart="startSwipe" @touchmove="moveSwipe"
        @touchend="endSwipe">
        <Card 
          :image="cards[cards.length - 1].image ?? ''" 
          :title="cards[cards.length - 1].nome"
          :description="cards[cards.length - 1].descricao" 
          :type="cards[cards.length - 1].tipo"
          :id="cards[cards.length - 1].id"
           />
      </div>
    </div>

    <!-- Render current and next cards when not re-stacking -->
    <div v-else>
      <!-- Carta Próxima (Atrás) -->
      <div v-if="cards.length > 1" class="card-container next-card" :style="{ zIndex: 1 }">
        <Card 
          :image="cards[cards.length - 2].image" 
          :title="cards[cards.length - 2].nome"
          :description="cards[cards.length - 2].descricao" 
          :type="cards[cards.length - 2].tipo"
          :id="cards[cards.length - 1].id" />
      </div>

      <!-- Carta Atual (Topo) -->
      <div v-if="cards.length > 0" class="card-container current-card"
        :class="[cards[cards.length - 1].tipo]" :style="{ zIndex: 2 }"
        ref="currentCardRef" @touchstart="startSwipe" @touchmove="moveSwipe" @touchend="endSwipe">
        <Card 
          :image="cards[cards.length - 1].image" 
          :title="cards[cards.length - 1].nome"
          :description="cards[cards.length - 1].descricao" 
          :type="cards[cards.length - 1].tipo"
          :id="cards[cards.length - 1].id"
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
  height: 380px;
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
</style>
