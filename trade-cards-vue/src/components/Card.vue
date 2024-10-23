<script lang="ts" setup>
import { computed } from 'vue';

// Definição das props
const {image, title, description, type} = defineProps({
  image: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    validator: (value) => ['blue', 'yellow', 'green'].includes(value),
  },
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
        // log details of event
        console.log('Card removed right:', cards.value[cards.value.length - 1]);
        cards.value.pop();
        console.log('Cards:', cards.value);
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
        console.log('Card removed left:', cards.value[cards.value.length - 1]);
        cards.value.pop();
        console.log('Cards:', cards.value);
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


// Mapeamento de tipos para classes de cor e ícones
const typeMappings = {
  blue: {
    class: 'blue-card',
    icon: 'https://cdn-icons-png.flaticon.com/512/1828/1828817.png', // Exemplo de ícone azul
  },
  yellow: {
    class: 'yellow-card',
    icon: 'https://cdn-icons-png.flaticon.com/512/1828/1828919.png', // Exemplo de ícone amarelo
  },
  green: {
    class: 'green-card',
    icon: 'https://cdn-icons-png.flaticon.com/512/1828/1828884.png', // Exemplo de ícone verde
  },
};

// Computed para obter a classe e o ícone com base no tipo
const cardTypeClass = computed(() => typeMappings[type].class);
const icon = computed(() => typeMappings[type].icon);

</script>

<template>
  <div :class="['game-card', cardTypeClass]">
    <!-- Cabeçalho: Ícone e Título -->
    <div class="flex items-center p-4 bg-blue">
      <img :src="icon" alt="Icon" class="w-6 h-6 mr-2" />
      <h3 class="text-lg font-semibold">{{ title }}</h3>
    </div>
    
    <!-- Imagem Principal -->
    <img :src="image" alt="Card Image" class="w-full h-48 object-cover" />
    
    <!-- Descrição -->
    <p class="p-4 text-gray-700">{{ description }}</p>
  </div>
</template>

<style scoped>
.game-card {
  /* Tailwind já lida com a maioria dos estilos, mas você pode adicionar mais se necessário */
  transition: transform 0.3s ease, box-shadow 0.3s ease;
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
</style>
