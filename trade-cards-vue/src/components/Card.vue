<script lang="ts" setup>
import { CartasType, CardTypeV2 } from 'type';
import { computed, PropType } from 'vue';

// Definição das props
const props = defineProps({
  card: {
    type: Object as PropType<CartasType>,
    required: true,
  },
  isBottomCard: {
    type: Boolean,
    default: false,
  },
});

// Computed para obter a classe e o ícone com base no tipo
const cardTypeClass = computed(() => `${props.card.type}-card`);
const isJokerCard = computed(() => props.card.type === CardTypeV2.Joker);

const titleCard = computed(() => {
  switch (props.card.type) {
    case CardTypeV2.Action:
      return 'Ação';
    case CardTypeV2.Object:
      return 'Objeto';
    case CardTypeV2.Condition:
      return 'Condição';
    case CardTypeV2.Connection:
      return 'Conexão';
    case CardTypeV2.Color:
      return 'Cor';
    default:
      return '';
  }
});

// Computed para obter a imagem da carta
const image = computed(() => {
  // Lógica para retornar a imagem com base na carta
  return `/assets/cards/${props.card.nome}.png`;
});
</script>

<template>
  <div :class="['card', cardTypeClass, { 'top-card': isBottomCard }]"
    class="w-[210px] h-[300px] rounded-[20px] flex flex-col overflow-hidden touch-pan-x touch-pan-y relative shadow-inner shadow-lg">
    <!-- Cabeçalho: Ícone e Título -->
    <div
      class="header flex items-center justify-between p-2 w-full bg-gradient-to-b from-white/60 to-transparent relative">
      <h3 class="title font-press-start text-base text-[#0c0c0c] uppercase leading-[1.2] text-center m-0 py-2">
        {{ titleCard }}
      </h3>
      <h2 class="rarity text-black text-xs font-bold uppercase p-1 rounded-[16px]" :class="`rarity-` + card.rarity">
        {{ card.rarity }}
      </h2>
      <!-- Linha abaixo do header -->
      <div class="absolute bottom-[-6px] left-1/2 transform -translate-x-1/2 w-4/5 h-px bg-white/70"></div>
    </div>

    <!-- Imagem Principal -->
    <div class="image-container flex-1 relative overflow-hidden items-center mt-1.5">
      <img v-if="!isJokerCard" :src="image" alt="Card Image"
        class="card-image object-cover w-[12.5rem] h-56 fixed top-16" />
    </div>

    <!-- Descrição -->
    <p
      class="description bg-white/80 backdrop-blur-md flex-shrink border-b-0 rounded-b-[14px] p-5 text-black text-base font-medium text-center leading-snug overflow-hidden">
      {{ card.nome }}
    </p>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

.font-press-start {
  font-family: 'Press Start 2P', sans-serif;
}

/* Estilos adicionais que não podem ser substituídos pelo Tailwind */
.card {
  box-shadow: inset 0 1px rgba(255, 255, 255, 0.5), 0 4px 8px rgba(0, 0, 0, 0.2);
}

.card::before {
  content: '';
  position: absolute;
  top: -40%;
  left: -30%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle at center, rgba(255, 255, 255, 0.4), transparent);
  transform: rotate(25deg);
}

/* Estilos para os tipos de cartas */
.action-card {
  @apply border-4;
  border-color: #61c5ff;
  background: linear-gradient(135deg, #61c5ff, #a2d2ff);
}

.action-card::before {
  background: radial-gradient(circle at center, rgba(97, 197, 255, 0.4), transparent);
}

/* Similar para .object-card, .condition-card, etc. */

/* Classes de raridade */
.rarity-basic {
  background: linear-gradient(to left, rgba(0, 0, 0, 0.9), rgb(70, 66, 66));
  color: white;
}

.rarity-common {
  background: linear-gradient(to left, rgba(255, 254, 254, 0.9), rgb(255, 255, 255));
}

.rarity-rare {
  background: linear-gradient(to left, rgba(149, 16, 226, 0.9), rgb(72, 11, 151));
  color: rgb(255, 230, 0);
}

.rarity-epic {
  background: linear-gradient(to left, rgba(255, 0, 0, 0.9), rgb(255, 0, 0));
  color: white;
}

.top-card {
  box-shadow: 8px -8px 12px rgba(0, 0, 0, 0.9);
}
</style>