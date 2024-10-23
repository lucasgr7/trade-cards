<template>
  <div class="card-deck">
    <!-- Re-stack Animation: render all cards stacked vertically when re-stacking -->
    <div v-if="isReStacking">
      <div
        v-for="(card, index) in cards"
        :key="card.id"
        class="card stacked-card"
        :style="{ zIndex: cards.length - index }"
        ref="el => stackedCardRefs.value[index] = el"
      >
        {{ card.content }}
      </div>
    </div>
    
    <!-- Render current and next cards when not re-stacking -->
    <div v-else>
      <!-- Carta Próxima (Atrás) -->
      <div
        v-if="cards.length > 1"
        class="card next-card"
        :style="{ zIndex: 1 }"
      >
        {{ cards[cards.length - 2].content }}
      </div>
      
      <!-- Carta Atual (Topo) -->
      <div
        v-if="cards.length > 0"
        class="card current-card"
        :style="{ zIndex: 2 }"
        ref="currentCardRef"
        @touchstart="startSwipe"
        @touchmove="moveSwipe"
        @touchend="endSwipe"
      >
        {{ cards[cards.length - 1].content }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue';
import { gsap } from 'gsap';

// Lista inicial de cartas com IDs únicos
const initialCards = [
  { id: 1, content: "Card 1" },
  { id: 2, content: "Card 2" },
  { id: 3, content: "Card 3" },
  { id: 4, content: "Card 4" },
  { id: 5, content: "Card 5" },
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

// Função para iniciar o swipe
const startSwipe = (event) => {
  touchStartX = event.touches[0].clientX;
};

// Função para mover o swipe e dar o efeito de curva
const moveSwipe = (event) => {
  touchMoveX = event.touches[0].clientX;
  const deltaX = touchMoveX - touchStartX;

  const currentCard = currentCardRef.value;

  if (currentCard) {
    gsap.to(currentCard, {
      x: deltaX,
      rotation: deltaX / 10,
      duration: 0,
      overwrite: 'auto',
    });
  }
};

// Função para finalizar o swipe e decidir se avança ou retorna
const endSwipe = () => {
  const deltaX = touchMoveX - touchStartX;
  const threshold = 50; // Limite para considerar o swipe

  const currentCard = currentCardRef.value;

  if (!currentCard) return;

  if (deltaX > threshold) {
    // Swipe Right
    gsap.to(currentCard, {
      x: 300,
      opacity: 0,
      rotation: 15,
      duration: 0.5,
      ease: "power2.out",
      onComplete: () => {
        // Remove a carta do topo
        cards.value.pop();
        remainingCards.value--;

        // Resetar a carta
        gsap.set(currentCard, { x: 0, opacity: 1, rotation: 0 });

        // Verificar se todas as cartas foram removidas
        if (cards.value.length === 0) {
          recarregarPilha();
        }
      },
    });
  } else if (deltaX < -threshold) {
    // Swipe Left
    gsap.to(currentCard, {
      x: -300,
      opacity: 0,
      rotation: -15,
      duration: 0.5,
      ease: "power2.out",
      onComplete: () => {
        // Remove a carta do topo
        cards.value.pop();
        remainingCards.value--;

        // Resetar a carta
        gsap.set(currentCard, { x: 0, opacity: 1, rotation: 0 });

        // Verificar se todas as cartas foram removidas
        if (cards.value.length === 0) {
          recarregarPilha();
        }
      },
    });
  } else {
    // Cancel Swipe
    gsap.to(currentCard, {
      x: 0,
      rotation: 0,
      duration: 0.5,
      ease: "power2.out",
    });
  }
};

// Função para recarregar a pilha de cartas (reempilhamento)
const recarregarPilha = () => {
  isReStacking.value = true;

  nextTick(() => {
    // Resetar as posições iniciais das cartas empilhadas
    gsap.set(stackedCardRefs.value, { y: -50, opacity: 0 });

    // Animar todas as cartas empilhadas verticalmente com um efeito de deslizamento
    gsap.to(stackedCardRefs.value, {
      y: 0,
      opacity: 1,
      stagger: 0.1,
      duration: 0.5,
      ease: "power2.out",
      onComplete: () => {
        // Resetar as cartas para o estado inicial
        cards.value = [...initialCards];
        remainingCards.value = cards.value.length;
        isReStacking.value = false;
        stackedCardRefs.value = [];
      },
    });
  });
};
</script>

<style scoped>
.card-deck {
  position: relative;
  width: 300px;
  height: 400px;
  perspective: 1000px;
  overflow: hidden;
  margin: auto;
}

.card {
  position: absolute;
  width: 280px; /* Reduzido para dar espaçamento */
  height: 380px; /* Reduzido para dar espaçamento */
  background-color: #ffffff;
  border-radius: 20px; /* Bordas arredondadas */
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2); /* Sombra para dar profundidade */
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  color: #333;
  cursor: grab;
  user-select: none;
  touch-action: none; /* Evita comportamentos padrões de swipe */
  top: 10px; /* Espaçamento superior */
  left: 10px; /* Espaçamento lateral */
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
