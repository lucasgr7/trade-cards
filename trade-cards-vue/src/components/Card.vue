<script lang="ts" setup>
import { computed } from 'vue';

// Definição das props
const { image, title, description, type } = defineProps({
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
    validator: (value: string) => ['action', 'object', 'condition'].includes(value),
  },
  id: {
    type: Number,
    required: false,
  }
});

// Mapeamento de tipos para classes de cor e ícones
const typeMappings: Record<string, { class: string; icon: string }> = {
  action: {
    class: 'blue-card',
    icon: 'https://cdn-icons-png.flaticon.com/512/1828/1828817.png', // Exemplo de ícone azul
  },
  object: {
    class: 'red-card',
    icon: 'https://cdn-icons-png.flaticon.com/512/1828/1828919.png', // Exemplo de ícone vermelho
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

</script>

<template>
  <div :class="['card', cardTypeClass]">
    <!-- Cabeçalho: Ícone e Título -->
    <div class="flex items-center gap-x-2 p-4" :class="['header', cardTypeClass]">
      <img :src="icon" alt="Icon" class="w-6 h-6 mr-2"/>
      <h3 class="text-sm font-semibold">{{ title }}</h3>
    </div>
    
    <!-- Imagem Principal -->
    <img :src="image" alt="Card Image" class="w-full h-40 object-contain" />
    
    <!-- Descrição -->
    <p class="p-4 text-black text-sm border-t-zinc-300">{{ description }}</p>
  </div>
</template>

<style scoped>
.card {
  width: 210px;
  height: 300px;
  border-radius: 20px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.header {
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  padding: 8px;
}

.blue-card {
  border: 6px solid #61c5ff;
}

.header.blue-card {
  background-color: #61c5ff;
}

.red-card {
  border: 6px solid #ffb1a3;
}

.header.red-card {
  background-color: #ffb1a3;
}

.green-card {
  border: 6px solid #a3ffab;
}

.header.green-card {
  background-color: #a3ffab;
}
</style>