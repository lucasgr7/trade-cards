<script lang='ts' setup>
import { useRouter, useRoute } from 'vue-router';
import Card from '@/components/Card.vue';
import { onMounted, ref, watch, computed } from 'vue';
import { Salas, useSalas } from '@/composables/apis/useSalas';
import { StatusMatch } from '@/enums/statusMatch';
import { usePlayerStore } from '@/state/usePlayerStore';
import { CardTypeV2, CartasType, DeckGameType, Rarity } from '@/type';
import HeaderPage from '@/components/HeaderPage.vue';
import Footer from '@/components/Footer.vue';

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
  image: 'joker.png',
}));
const footerMsg = 'Crie a condição da sua carta coringa.';

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
  <div class="flex flex-col items-center justify-between p-4 text-game
    border border-white rounded-xl bg-trade-blue-100 text-center
    w-screen h-screen">
    <HeaderPage title="Cartas coringa" @leaveGame="leave"/>
    <Card :isJokerCreation="true" :card="jokerCard"/>
    <div class="flex flex-col items-center gap-y-2 text-xs pt-4">
      <p class="text-trade-blue-900">Cartas coringas restantes:</p>
      <span class="text-trade-blue-900 border bg-white rounded-full p-2 w-8 text-center">
        {{ jokerCardsCount }}</span>
    </div>
    <div class="flex flex-col text-xs">
      <input type="text" v-model="jokerCardDescription" @keyup.enter="saveJokerCard" :maxlength="21"
        placeholder="Condição" class="p-6 border border-black rounded-xl mb-4 bg-white text-black" />
      <button @click="saveJokerCard" class="p-6 bg-trade-blue-300 text-white rounded-xl border border-black">Salvar</button>
    </div>
    <Footer :message="footerMsg" />
  </div>
</template>

<style scoped lang='scss'></style>