<script lang='ts' setup>
import { useRouter, useRoute } from 'vue-router';
import Card from '@/components/Card.vue';
import { onMounted, ref, watch, computed } from 'vue';
import { Salas, useSalas } from '@/composables/apis/useSalas';
import { StatusMatch } from '@/enums/statusMatch';
import { usePlayerStore } from '@/state/usePlayerStore';
import { CardTypeV2, CartasType, DeckGameType, Rarity } from '@/type';

const router = useRouter();
const route = useRoute();
const jokerCardDescription = ref('');
const jokerCardsCount = ref(0);
const jokerCardsList = ref<CartasType[]>([]);
const store = usePlayerStore();
const { sala, updateRecord, getPlayersFromSession, subscribeToChanges } = useSalas(store.getMyself);
const jokerCard = computed(() => ({ 
  description: '',
  nome: jokerCardDescription.value,
  input: jokerCardDescription.value,
  type: CardTypeV2.Joker, 
  rarity: Rarity.joker,
}));

const deck = route.params.deck as string;
if (deck === DeckGameType.Sun) {
  jokerCardsCount.value = 2;
} else if (deck === DeckGameType.Moon) {
  jokerCardsCount.value = 5;
}

function leave() {
  router.push('/');
}

function saveJokerCard() {
  if (jokerCardDescription.value.trim()) {
    jokerCardsList.value.push(jokerCard.value);
    jokerCardDescription.value = '';
    jokerCardsCount.value--;
  }
}

watch(jokerCardsCount, async (newValue) => {
  if (newValue === 0) {
    store.deck.push(...jokerCardsList.value);
    store.shuffleDeck();
    await updateRecord(sala.value?.id as number, { ...sala.value, estado: StatusMatch.INITSTATUS });
  }
});

onMounted(() => {
  getPlayersFromSession(route.params.id);
  const roomId = Number(route.params.id ?? 0);
  subscribeToChanges(roomId, (payload: Salas) => {
    if (payload.id === roomId && payload.estado === StatusMatch.INITSTATUS) {
      store.clearBagOfCards();
      store.deckType = deck as DeckGameType;
      router.push(`/match/${roomId}`);
    }
  });
});

</script>

<template>
  <div class="flex flex-col items-center justify-between p-4
    border border-white rounded-xl bg-trade-blue-100
    w-screen h-screen">
    <div class="flex w-full items-center">
      <button @click="leave"
        class="absolute top-4 right-0 mb-4 mr-1 text-trade-blue-900 border-2 border-black bg-trade-red-500 p-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <h1 class="text-3xl font-black text-outline-blue mb-8">Cartas coringa</h1>
    </div>
    <Card :isJokerCard="true" :card="jokerCard"/>
    <div class="flex flex-col items-center gap-y-6">
      <p class="text-trade-blue-900">Cartas coringas restantes:</p>
      <span class="text-trade-blue-900 text-3xl border bg-white rounded-full p-2 w-14 text-center">{{ jokerCardsCount
        }}</span>
    </div>
    <div class="flex flex-col">
      <input type="text" v-model="jokerCardDescription" @keyup.enter="saveJokerCard" :maxlength="40"
        placeholder="Condição" class="p-6 border border-black rounded-xl mb-4 bg-white text-black" />
      <button @click="saveJokerCard" class="p-6 bg-trade-blue-300 text-white rounded-xl">Salvar</button>
    </div>
    <p class="text-trade-blue-900">Crie a condição da sua carta coringa.</p>
  </div>
</template>

<style scoped lang='scss'></style>