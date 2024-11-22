<script lang='ts' setup>
import { onMounted, ref } from 'vue';
import UserPicture from '@/components/UserPicture.vue';
import { Salas, useSalas } from '@/composables/apis/useSalas';
import { useRoute } from 'vue-router';
import router from '@/util/router';
import { usePlayer } from '@/composables/state/usePlayer';
import { usePartidas } from '@/composables/apis/usePartidas';
import { useDeck } from '@/composables/game/useDeck';
import { Partidas, Jogador } from 'type';
import { StatusMatch } from '@/enums/statusMatch';

const { getMyself } = usePlayer();
const { updateRecord,
  getPlayersFromSession,
  sala,
  players,
  isMyselfCreatorSession,
  subscribeToChanges } = useSalas(getMyself);
const { generateSingleDeck, generateDeck } = useDeck();
const { insertRecord } = usePartidas();
const route = useRoute();

const sentences = [
  "Tá cansado de esperar",
  "Quer trocar presentes",
  "Acha que não vai dar bom",
  "Tá querendo beber depois do jogo",
  "Tá impaciente",
  "Quer jogar logo",
  "Quer trocar figurinhas"
];
const randomSentence = ref('');

async function startGame() {
  // what data do we need to start the game?
  if(!sala.value) return;
  const totalPartidas = import.meta.env.VITE_DEFAULT_RODADAS ?? 9;

  const match: Partidas = {
    sala_id: sala.value?.id as number,
    jogadores: sala.value?.jogadores || [],
    estado: StatusMatch.WAITINGSTATUS,
    acoes: [],
    cartas_disponiveis: generateDeck(sala.value, totalPartidas),
    rodada_atual: 0,
  };

  // insert the match in the database
  await updateRecord(sala.value.id as number, { ...sala.value, estado: StatusMatch.INITSTATUS });
  await insertRecord(match);
}

async function leave() {
  if (!sala.value) return;

  const playerIndex = sala.value.jogadores.findIndex((jogador: Jogador) => jogador.nickname === getMyself.value.nickname);
  if (playerIndex === -1) {
    alert('Jogador não encontrado na sala.');
    return;
  }

  sala.value.jogadores.splice(playerIndex, 1);
  await updateRecord(sala.value.id as number, sala.value);
  router.push('/sessions');
}

function getRandomSentence() {
  const randomIndex = Math.floor(Math.random() * sentences.length);
  randomSentence.value = sentences[randomIndex];
}

onMounted(() => {
  getRandomSentence();
  getPlayersFromSession(route.params.id);
  const roomId = Number(route.params.id ?? 0);
  subscribeToChanges(roomId, (payload: Salas) => {
    if (payload.id === roomId && payload.estado === StatusMatch.INITSTATUS) {
      router.push(`/match/${roomId}`);
    }
  });
});

</script>

<template>
  <div class="flex flex-col items-center justify-between p-4
    border border-white rounded-xl bg-trade-blue-600
    w-screen h-screen">
    <div class="flex justify-between items-center w-[20rem] bg-trade-red-500 h-24 rounded-xl px-5 border border-white mt-12">
      <UserPicture :src="getMyself.avatarUrl"/>
      <div class="flex flex-col">
        <h1 class="text-3xl truncate w-full">{{ getMyself.nickname }}</h1>
        <p>{{ randomSentence }}</p>
      </div>
    </div>
    <div class="flex flex-col w-full gap-y-4 max-h-[26rem] mb-12">
      <h2 class="text-2xl font-bold text-white">Jogadores na sala:</h2>
      <div class="flex w-full border-t-4 border-b-4 border-trade-blue-900 max-h-96 overflow-y-auto px-1">
        <ul class="flex flex-wrap">
          <li v-for="jogador in players" :key="jogador.seed">
            <div :style="{ backgroundColor: jogador?.color }" class="p-2 m-2 text-black flex flex-col items-center justify-center
            border rounded-xl border-trade-blue-900 w-[6rem] h-40">
              <UserPicture :src="jogador.avatarUrl || ''" class="user-picture-small" />
              <div class="flex w-full border-t-4 border-trade-blue-900 mt-2"></div>
              <div class="h-16 flex flex-col items-center justify-center">
                <p class="text-white flex-wrap">{{ jogador.nickname }}</p>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="flex gap-x-2">
      <button @click="leave" class="border border-white rounded-full py-4 px-14 bg-trade-blue-50 font-bold text-xl">
        Sair
      </button>
      <button v-if="isMyselfCreatorSession" @click="startGame"
        class="border border-white rounded-full py-4 px-14 bg-trade-red-500 font-bold text-xl">
        Jogar
      </button>
      <button v-else class="border border-white rounded-full py-4 px-10 bg-trade-red-500 font-bold text-xl">
        Acelerar o ínicio
      </button>
    </div>
  </div>
</template>

<style scoped lang='scss'>
.user-picture-small {
  width: 75px;
  height: 75px;
}
</style>