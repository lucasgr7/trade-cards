<script lang="ts" setup>
import { CardTypeV2 } from '@/type';
import { computed, PropType } from 'vue';
import { CartasType } from 'type';

// Definição das props
const {isBottomCard, card} = defineProps({
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
const cardTypeClass = computed(() => `card ${card.type}-card`);
const isJokerCard = computed(() => card.type === CardTypeV2.Joker);

const titleCard = computed(() => {
  switch(card.type){
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
})
const image = computed(() => {
  switch(card.type){
    case CardTypeV2.Action:
      return '/v2/action.png';
    case CardTypeV2.Object:
      return '/v2/object.png';
    case CardTypeV2.Condition:
      return '/v2/condition.png';
    case CardTypeV2.Connection:
      return '/v2/connection.png';
    case CardTypeV2.Color:
      return '/v2/color.png';
    default:
      return '';
  }
})

const icon = computed(() => typeMappings[card.type]?.icon ?? '');

</script>

<template>
  <div :class="['card', cardTypeClass, { 'top-card': isBottomCard }]">
    <!-- Cabeçalho: Ícone e Título -->

    <div class="header flex items-center justify-between">
      <h3 class="title font-semibold">{{ titleCard }}</h3>
      <h2 class="text-black text-xs rarity" :class="`rarity-` + card.rarity">{{ card.rarity }}</h2>
    </div>
    
    <!-- Imagem Principal -->
    <div class="image-container">
      <img v-if="!isJokerCard" 
      :src="image" 
      alt="Card Image" 
      class="card-image object-cover w-[12.5rem] h-56 fixed top-16" />
    </div>
    
    <!-- Descrição -->
    <p class="description text-game h-20 break-words text-middle">{{ card.nome }}</p>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

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
.action-card {
  border: 4px solid #61c5ff;
  background: linear-gradient(135deg, #61c5ff, #a2d2ff);
}

.action-card::before {
  background: radial-gradient(circle at center, rgba(97,197,255,0.4), transparent);
}

/* Estilos para cartas vermelhas */
.card.object-card {
  border: 4px solid #ffb1a3;
  background: linear-gradient(135deg, #ffb1a3, #ff6347);
}

.card.object-card::before {
  background: radial-gradient(circle at center, rgba(255,177,163,0.4), transparent);
}

/* Estilos para cartas verdes */
.card.condition-card {
  border: 4px solid #178520;
  background: linear-gradient(135deg, #178520, #a0ffa0);
}

.card.condition-card::before {
  background: radial-gradient(circle at center, rgba(23,133,32,0.4), transparent);
}

/* Estilos para cartas amarelas */
.card.connection-card {
  border: 4px solid #f7d154;
  background: linear-gradient(135deg, #f7d154, #f7f754);
}

.card.connection-card::before {
  background: radial-gradient(circle at center, rgba(247,209,84,0.4), transparent);
}

/* Estilos para cartas roxas */
.card.color-card {
  border: 4px solid #a35ff7;
  background: linear-gradient(135deg, #a35ff7, #d2a2ff);
}

.card.color-card::before {
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
  font-family: 'Press Start 2P', sans-serif;
  color: #0c0c0c;
  font-size: 1rem;
  text-align: center;
  margin: 0;
  padding: 8px 0;
  line-height: 1.2;
  text-transform: uppercase;
  text-shadow:
    1px 1px 0 #fff,
    2px 2px 0 #ccc;
}

.image-container {
  flex: 1;
  position: relative;
  overflow: hidden;
  place-items: center;
  margin-top: 6px;
}

.description {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(5px);
  flex-shrink: 10;
  border-radius: 0 0 14px 14px;
  padding: 20px;
  color: #000;
  font-size: 16px;
  font-weight: 500;
  text-align: center;
  line-height: 1.5;
  overflow: hidden;
}

.top-card {
  box-shadow: 8px -8px 12px rgba(0, 0, 0, 0.9);
}
/* Classes de raridade */

.rarity{
  border-radius: 16px;
  font-weight: bold;
  text-transform: uppercase;
  padding: 4px;
}
.rarity-basic {
  /* style pill */
  background: linear-gradient(to left, rgba(0, 0, 0, 0.904), rgb(70, 66, 66));
  color: white;
}

.rarity-common {
  /* Estilos específicos para raridade comum */
  background: linear-gradient(to left, rgba(255, 254, 254, 0.904), rgb(255, 255, 255));
  padding: 3px;
}

.rarity-rare {
  /* Estilos específicos para raridade rara */
  background: linear-gradient(to left, rgba(149, 16, 226, 0.904), rgb(72, 11, 151));
  color: rgb(255, 230, 0);
}

.rarity-epic {
  /* Estilos específicos para raridade épica */
  background: linear-gradient(to left, rgba(255, 0, 0, 0.904), rgb(255, 0, 0));
  color: white;
}
</style>