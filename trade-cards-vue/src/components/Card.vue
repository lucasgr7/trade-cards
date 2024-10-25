<script lang="ts" setup>
import { computed } from 'vue';

// Definição das props
const {image, title, description, type, choseCard} = defineProps({
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
    validator: (value: string) => ['blue', 'red', 'green'].includes(value),
  },
  choseCard: {
    type: Function,
  },
  id: {
    type: Number,
    required: false,
  }
});

// Mapeamento de tipos para classes de cor e ícones
const typeMappings = {
  action: {
    class: 'blue-card',
    icon: 'https://cdn-icons-png.flaticon.com/512/1828/1828817.png', // Exemplo de ícone azul
  },
  object: {
    class: 'red-card',
    icon: 'https://cdn-icons-png.flaticon.com/512/1828/1828919.png', // Exemplo de ícone amarelo
  },
  condition: {
    class: 'green-card',
    icon: 'https://cdn-icons-png.flaticon.com/512/1828/1828884.png', // Exemplo de ícone verde
  },
};

// Computed para obter a classe e o ícone com base no tipo
const cardTypeClass = computed(() => {
  return typeMappings[type].class
});
const icon = computed(() => typeMappings[type].icon);

function handleCardClick() {
  if (choseCard) {
    choseCard(title);
  }
}

</script>

<template>
  <div :class="['card', cardTypeClass]">
    <!-- Cabeçalho: Ícone e Título -->
    <div class="flex items-center gap-x-2 p-4" :class="['header', cardTypeClass]">
      <img :src="icon" alt="Icon" class="w-6 h-6 mr-2" @click="handleCardClick"/>
      <h3 class="text-sm font-semibold">{{ title }}</h3>
      <!-- create a right circle on the right with tailwind -->
      <div class="flex-grow">
        <div class="flex justify-end">
          <div class="w-6 h-6 rounded-full font-semibold text-sm bg-white">
            🌌
          </div>
        </div>
      </div>
    </div>
    
    <!-- Imagem Principal -->
    <img :src="image" alt="Card Image" class="w-full h-48 object-contain" />
    
    <!-- Descrição -->
     <!-- q: tailwind border radius 20px 
      a: border-radius- -->
    <p class="p-4 text-black border-t-zinc-300">{{ description }}</p>
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
  border-radius: 20px; /* Bordas arredondadas */
}


/* Carta atual com maior z-index */
.current-card {
  z-index: 2;
}


.blue-card{
  border: 6px solid #61c5ff;
}
.header.blue-card{
  background-color: #61c5ff;
  padding: 8px;
}
.red-card{
  border: 6px solid #ffb1a3;
}

.header.red-card{
  background-color: #ffb1a3;
  padding: 8px;
}
.green-card{
  border: 6px solid #a3ffab;
}

.header.green-card{
  background-color: #a3ffab;
  padding: 8px;
}
</style>
