<script lang="ts" setup>
import { CardTypeV3, TradingCard } from '@/type';
import { computed, PropType } from 'vue';

// Definição das props
const props = defineProps({
  card: {
    type: Object as PropType<TradingCard>,
    required: true,
  },
  isBottomCard: {
    type: Boolean,
    default: false,
  },
  isJokerCreation: {
    type: Boolean,
    default: false,
  },
  small: {
    type: Boolean,
    default: false,
  }
});

const cardTypeClass = computed(() => `${props.card?.type}-card`);

const title = computed(() => {
  // if contains the word 'Negativa' return only Negativa
  return props.card?.title ?? props.card.description;
})

const image = computed(() => {
  // count number of compositions 
  if (props.card.image) {
    return `/v2/${props.card.image}`;
  }
  const weight = props.card.weight > 4 ? 4 : props.card.weight;
  return `/v2/${props.card.type}${weight}.png`;
});

const fontSizeClass = computed(() => {
  const length = props.card.completeText?.length ?? 0;
  if (length <= 32) {
    return 'text-lg';
  } else if (length <= 56) {
    return 'text-base';
  } else {
    return 'text-sm';
  }
});

const friendlyCompositionMessage = computed(() => {
  const compositions = props.card.compositions;
  if (!compositions) return '';

  const emojiMap: { [key: string]: string } = {
    ClothingType: '👗',
    Positioning: '📍',
    Player: '🧑',
    ColorVariant: '🎨',
    WrappedState: '🎁',
    // Add more mappings as needed
  };

  const messages: string[] = [];
  for (const [key, values] of Object.entries(compositions)) {
    const emoji = emojiMap[key] || '';
    messages.push(`${emoji} ${values.join(', ')}`);
  }

  return `${messages.join('<br/>')}`; // Use HTML line breaks
});
</script>

<template>
  <div :class="['card', cardTypeClass, { 'top-card': isBottomCard }, {'small': small}]"
    class="w-[13rem] h-[20rem] rounded-[20px] flex flex-col overflow-hidden touch-pan-x touch-pan-y relative shadow-lg">
    <!-- Cabeçalho: Ícone e Título -->
    <div
      class="header flex items-center justify-between p-2 w-full bg-gradient-to-b from-white/60 to-transparent relative h-6">
      <h3 class="title font-press-start text-[0.6rem] text-[#0c0c0c] uppercase leading-[1.2] text-center m-0 py-2"
        :class="{ 'text-[8px]': card.title.length >= 10, 'text-[0.5rem]': card.title.length < 10 }">
        {{ title }}
      </h3>
      <h2 class="rarity text-black text-[0.5rem] font-bold uppercase p-1 rounded-[16px]"
        :class="`rarity-` + card.weight">
        {{ card.weight }}
      </h2>
      <!-- Linha abaixo do header -->
      <div class="absolute bottom-[-8px] left-1/2 transform -translate-x-1/2 w-4/5 h-px bg-white/70"></div>
    </div>



    <div :class="['flex justify-center items-center mt-1.5 relative h-72']">
      <img :src="image" alt="Card Image"
      :class="['card-image object-fit w-40 h-40 rounded-md', isJokerCreation ? 'top-[14.5rem]' : 'top-16']" />
    </div>

    <!-- Descrição -->
    <div class="bg-white/70 text-black  font-mono  overflow-hidden mt-2 pt-4 h-full" v-if="!small">
       <p v-if="card.type == CardTypeV3.Action || card.type === CardTypeV3.Subtraction" :class="['description text-center', fontSizeClass]"
         >
        {{ card.completeText }}
      </p>
      <p v-if="card.type === CardTypeV3.Seat || card.type === CardTypeV3.Gift" :class="['description text-center', fontSizeClass]">
        <span v-html="friendlyCompositionMessage"></span>
      </p>
     </div>
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

.description {
  --tw-backdrop-blur: blur(4px);
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
  border-width: 4px;
  border-color: #61c5ff;
  background: linear-gradient(135deg, #61c5ff, #a2d2ff);
}

.action-card::before {
  background: radial-gradient(circle at center, rgba(97, 197, 255, 0.4), transparent);
}

/* Similar para .object-card, .gift-card, etc. */

/* Estilos para cartas vermelhas */
.card.subtraction-card {
  border: 4px solid #ffb1a3;
  background: linear-gradient(135deg, #ffb1a3, #ff6347);
}

.card.subtraction-card::before {
  background: radial-gradient(circle at center, rgba(255, 177, 163, 0.4), transparent);
}

/* Estilos para cartas verdes */
.card.gift-card {
  border: 4px solid #178520;
  background: linear-gradient(135deg, #178520, #a0ffa0);
}

.card.gift-card::before {
  background: radial-gradient(circle at center, rgba(23, 133, 32, 0.4), transparent);
}

/* Estilos para cartas amarelas */
.card.object-card {
  border: 4px solid #f7d154;
  background: linear-gradient(135deg, #f7d154, #f7f754);
}

.card.object-card::before {
  background: radial-gradient(circle at center, rgba(247, 209, 84, 0.4), transparent);
}

/* Estilos para cartas roxas */
.card.seat-card {
  border: 4px solid #a35ff7;
  background: linear-gradient(135deg, #a35ff7, #d2a2ff);
}

.card.seat-card::before {
  background: radial-gradient(circle at center, rgba(163, 95, 247, 0.4), transparent);
}

/* Estilos para cartas coringa cinza*/
.card.joker-card {
  border: 4px solid #d3d3d3;
  background: linear-gradient(135deg, #c7c7c7, #ffffff);
}

.card.joker-card::before {
  background: radial-gradient(circle at center, rgba(211, 211, 211, 0.4), transparent);
}


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

.small {
  transform: scale(0.75);
  width: 4.7rem;
  height: 6.55rem;
}

.small .title {
  font-size: 0.4rem;
}


.small .card-image {
  width: 55px;
  height: 55px;
}

.small .description {
  font-size: 0.539rem;
  padding: 1.54px;
  height: 15.4px;
}

.text-lg {
  font-size: 1.25rem;
}

.text-base {
  font-size: 1rem;
}

.text-sm {
  font-size: 0.875rem;
}
</style>