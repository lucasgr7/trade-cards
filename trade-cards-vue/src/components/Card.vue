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
  <div :class="['card', cardTypeClass]">
    <!-- Cabeçalho: Ícone e Título -->
    <div class="flex items-center p-4 bg-blue" :class="['header', cardTypeClass]">
      <img :src="icon" alt="Icon" class="w-6 h-6 mr-2" />
      <h3 class="text-lg font-semibold">{{ title }}</h3>
      <div class="flex-grow right text-base bg-white w-4">
        3/2
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

.yellow{
  border: 6px solid #fff9a3;
}
.green{
  border: 6px solid #a3ffab;
}
</style>
