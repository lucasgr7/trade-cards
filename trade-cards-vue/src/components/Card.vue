<script lang="ts" setup>
import { CardTypeV2 } from '@/type';
import { computed, PropType } from 'vue';

// Definição das props
const { image, title, description, type, isBottomCard } = defineProps({
  image: {
    type: String,
    required: false,
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
    type: String as PropType<CardTypeV2>,
    required: true
  },
  id: {
    type: Number,
    required: false,
  },  
  isBottomCard: {
    type: Boolean,
    required: false,
    default: false,
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
  connection: {
    class: 'yellow-card',
    icon: 'https://cdn-icons-png.flaticon.com/512/1828/1828884.png', // Exemplo de ícone verde
  },
  color: {
    class: 'purple-card',
    icon: 'https://cdn-icons-png.flaticon.com/512/1828/1828884.png', // Exemplo de ícone verde
  }
};

// Computed para obter a classe e o ícone com base no tipo
const cardTypeClass = computed(() => {
  return typeMappings[type]?.class ?? 'default'
});
const icon = computed(() => typeMappings[type]?.icon ?? '');

</script>
<template>
  <div :class="['card', cardTypeClass, { 'top-card': isBottomCard }]">
    <!-- Cabeçalho: Ícone e Título -->
    <div class="header flex items-center gap-x-2" :class="['header', cardTypeClass]">
      <img :src="icon" alt="Icon" class="icon w-6 h-6 mr-2"/>
      <h3 class="title text-sm font-semibold">{{ title }}</h3>
    </div>
    
    <!-- Imagem Principal -->
    <div class="image-container">
      <img :src="image" alt="Card Image" class="card-image h-40 object-contain" />
    </div>
    
    <!-- Descrição -->
    <p class="description">{{ description }}</p>
  </div>
</template>
<style scoped>
/* Estilos padrão da carta */
.card {
  width: 210px;
  height: 300px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  touch-action: pan-x pan-y;
  position: relative;
  box-shadow: inset 0 1px rgba(255,255,255,0.5), 0 4px 8px rgba(0,0,0,0.2);
}

/* Efeito glossy padrão */
.card::before {
  content: '';
  position: absolute;
  top: -40%;
  left: -30%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle at center, rgba(255,255,255,0.4), transparent);
  transform: rotate(25deg);
}

/* Estilos para cartas azuis */
.card.blue-card {
  border: 4px solid #61c5ff;
  background: linear-gradient(135deg, #61c5ff, #a2d2ff);
}

.card.blue-card::before {
  background: radial-gradient(circle at center, rgba(97,197,255,0.4), transparent);
}

/* Estilos para cartas vermelhas */
.card.red-card {
  border: 4px solid #ffb1a3;
  background: linear-gradient(135deg, #ffb1a3, #ff6347);
}

.card.red-card::before {
  background: radial-gradient(circle at center, rgba(255,177,163,0.4), transparent);
}

/* Estilos para cartas verdes */
.card.green-card {
  border: 4px solid #178520;
  background: linear-gradient(135deg, #178520, #a0ffa0);
}

.card.green-card::before {
  background: radial-gradient(circle at center, rgba(23,133,32,0.4), transparent);
}

/* Estilos para cartas amarelas */
.card.yellow-card {
  border: 4px solid #f7d154;
  background: linear-gradient(135deg, #f7d154, #f7f754);
}

.card.yellow-card::before {
  background: radial-gradient(circle at center, rgba(247,209,84,0.4), transparent);
}

/* Estilos para cartas roxas */
.card.purple-card {
  border: 4px solid #a35ff7;
  background: linear-gradient(135deg, #a35ff7, #d2a2ff);
}

.card.purple-card::before {
  background: radial-gradient(circle at center, rgba(163,95,247,0.4), transparent);
}


/* Restante dos estilos */
.header {
  padding: 8px;
  width: 100%;
  border: 0 !important;
  background: linear-gradient(to bottom, rgba(255,255,255,0.6), rgba(255,255,255,0));
}

.header::after {
  content: '';
  position: absolute;
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  height: 1px;
  background: rgba(255,255,255,0.7);
}

.icon {
  filter: drop-shadow(0 1px 1px rgba(0,0,0,0.3));
}

.title {
  color: #000;
  text-shadow: 0 1px 1px rgba(0,0,0,0.3);
}

.image-container {
  flex: 1;
  position: relative;
  overflow: hidden;
  place-items: center;
  margin-top: 6px;
}

.card-image {
  border-radius: 20%;
}

.description {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(4px);
  flex-shrink: 0;
  border-radius: 0 0 14px 14px;
  padding: 16px;
  color: #000;
  font-size: 14px;
}

.top-card {
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.4);
}
</style>