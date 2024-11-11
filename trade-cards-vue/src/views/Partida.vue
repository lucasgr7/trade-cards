<script lang="ts" setup>
import { onMounted, ref, computed } from 'vue';
import CardDeck from '@/components/CardDeck.vue';
import CardChosen from '@/components/CardChosen.vue';
import { CardType } from '@/enums/cardType';
import { useRoute, useRouter } from 'vue-router';
import { usePartidas } from '../composables/usePartidas';
import { usePlayer } from '@/composables/usePlayer';
import { useCardsInGame } from '@/composables/useCardsInGame';
import { Cartas } from 'type';

const route = useRoute();
const router = useRouter();
const { getMyself } = usePlayer();
const { partida, initialize, usarCarta } = usePartidas(getMyself);
const { cartasDeck } = useCardsInGame();

const selectedActionCard = ref<Cartas>();
const selectedObjectCard = ref<Cartas>();
const selectedConditionCard = ref<Cartas>();

const cardPiles = [
  { type: CardType.Action, card: selectedActionCard },
  { type: CardType.Object, card: selectedObjectCard },
  { type: CardType.Condition, card: selectedConditionCard }
];

onMounted(async () => {
  await initialize(route, router);
});

function leave() {
  const roomId = Number(route.params.id ?? 0);
  router.push(`/waiting-room/${roomId}`);
}

const cardDeckRef = ref<InstanceType<typeof CardDeck> | null>(null);

function handleUsarCarta() {
  cardDeckRef.value?.handleUsarCarta();
}

function onUsarCarta(carta: any) {
  usarCarta(carta);
  const cartaTipo = carta.tipo.toLowerCase();

  const cardMap = {
    [CardType.Action.toLowerCase()]: selectedActionCard,
    [CardType.Object.toLowerCase()]: selectedObjectCard,
    [CardType.Condition.toLowerCase()]: selectedConditionCard,
  };

  const selectedCard = cardMap[cartaTipo];

  if (!selectedCard || selectedCard.value) {
    alert('Você já escolheu uma carta desse tipo.');
    return;
  }

  selectedCard.value = carta;
  //atualiza o deck mostrado na tela
  cardDeckRef.value?.removeCard(selectedCard.value);
}

const allPilesFilled = computed(() => {
  return cardPiles.every(pile => pile.card.value);
});

const displayFinalAction = computed(() => {
  if (getMyself) {
    return "Trocar!";
  }
  return "Esperando Troca!";
});

</script>
<template>
  <div class="flex flex-col items-center justify-between p-4
    border border-white rounded-xl bg-trade-blue-50
    w-screen h-screen">
    <div class="flex flex-col w-full items-center justify-center mt-4 gap-y-4">
      <button @click="leave" class="absolute top-1 right-0 mb-4 mr-1 text-trade-blue-900 border-2 border-black bg-trade-red-500 p-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
    <h1 class="text-4xl font-black text-outline-blue mt-2">Trade-Cards {{ partida?.sala_id }}</h1>
    <p class="text-blue-900 mt-2 mb-4">Escolha as cartas do deck para montar uma ação.</p>
    <div class="flex gap-x-2">
      <CardChosen
        v-for="(pile, index) in cardPiles"
        :key="index"
        :cardType="pile.type"
        :noCard="!pile.card.value"
        :nome="pile.card?.value?.nome"
        :descricao="pile.card?.value?.descricao"
        :image="pile.card?.value?.image"
        :tipo="pile.card?.value?.tipo"
      />
    </div>
    <CardDeck ref="cardDeckRef" :cards="cartasDeck" @usarCarta="onUsarCarta"/>
    <button @click="handleUsarCarta"
        :disabled="allPilesFilled"
        :class="['border border-white rounded-full py-6 px-20 font-bold text-xl', allPilesFilled ? 'bg-yellow-400' : 'bg-trade-green-400']">
        {{ allPilesFilled ? displayFinalAction : 'Jogar' }}
    </button>
  </div>
</template>

<style lang="css">
h1 {
  text-align: center;
}
</style>