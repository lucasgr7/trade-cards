<script lang='ts' setup>
import { onMounted, ref } from 'vue';
import UserPicture from '../components/UserPicture.vue';
import { useSalas } from '../composables/useSalas';
import { useRoute } from 'vue-router';
import router from '../util/router';
import { usePlayer } from '../composables/usePlayer';
import { usePartidas } from '../composables/usePartidas';

const { getMyself } = usePlayer();
const { updateRecord,
  getPlayersFromSession,
  sala,
  players,
  isMyselfCreatorSession } = useSalas(getMyself);
const { } = usePartidas();
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

function startGame() {
  if (sala.value) {
    router.push({ name: 'Partida', params: { id: sala.value.id } });
  }
}

function leave() {
  if (!sala.value) return;

  const playerIndex = sala.value.jogadores.findIndex(jogador => jogador.nickname === getMyself.value.nickname);
  if (playerIndex === -1) {
    alert('Jogador não encontrado na sala.');
    return;
  }

  sala.value.jogadores.splice(playerIndex, 1);

  updateRecord(sala.value.id as number, sala.value);
  router.push('/sessions');
}

function getRandomSentence() {
  const randomIndex = Math.floor(Math.random() * sentences.length);
  randomSentence.value = sentences[randomIndex];
}

onMounted(() => {
  getRandomSentence();
  getPlayersFromSession(route.params.id);
});

</script>

<template>
  <div class="flex flex-col items-center justify-between p-4
    border border-white rounded-xl bg-trade-blue-600
    w-screen h-screen">
    <div class="flex justify-between items-center w-full bg-trade-red-500 h-28 rounded-xl px-5 border border-white">
      <UserPicture :src="getMyself.avatarUrl" />
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
      <button @click="startGame" v-else class="border border-white rounded-full py-4 px-14 bg-trade-red-500 font-bold text-xl">
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