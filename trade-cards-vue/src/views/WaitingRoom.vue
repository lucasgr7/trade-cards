<script lang='ts' setup>
import { onMounted, ref } from 'vue';
import UserPicture from '../components/UserPicture.vue';
import { Salas, useSalas } from '../composables/useSalas';
import { useRoute } from 'vue-router';
import router from '../util/router';
import { Jogador } from '../composables/usePartidas';

const { getRecordById, updateRecord } = useSalas();
const route = useRoute();

const sala = ref<Salas | null>(null);
const players = ref<Jogador[]>([]);
const sentences = [
  "Tá cansado de esperar",
  "Quer trocar presentes",
  "Quer troca-troca",
  "Tá querendo beber depois do jogo",
  "Tá impaciente",
  "Quer jogar logo",
  "Quer trocar figurinhas"
];
const randomSentence = ref('');

const myPlayer = ref({
  nickname: localStorage.getItem('nickname'),
  avatar: localStorage.getItem('avatarUrl') ?? '',
});

async function getPlayersFromSession() {
  if (!route.params.id) return;

  const salaId = Number(route.params.id);
  const salaData = await getRecordById(salaId);

  if (!salaData) {
    alert('Sala não encontrada.');
    return;
  }

  sala.value = salaData;
  players.value = salaData.jogadores
    .filter((jogador: Jogador) => jogador.nome !== myPlayer.value.nickname)
    .map((jogador: Jogador) => ({
      ...jogador,
      color: generateRandomColor()
    }));
}

//TODO: Implement startGame function
function startGame() {
  alert('Jogo iniciado!');
}

function leave() {
  if (!sala.value) return;

  const playerIndex = sala.value.jogadores.findIndex(jogador => jogador.nome === myPlayer.value.nickname);
  if (playerIndex === -1) {
    alert('Jogador não encontrado na sala.');
    return;
  }

  sala.value.jogadores.splice(playerIndex, 1);

  updateRecord(sala.value.id as number, sala.value);
  router.push('/sessions');
}

function generateRandomColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}

function getRandomSentence() {
  const randomIndex = Math.floor(Math.random() * sentences.length);
  randomSentence.value = sentences[randomIndex];
}

onMounted(() => {
  getPlayersFromSession();
  getRandomSentence();
});

</script>

<template>
  <div class="flex flex-col items-center justify-between p-4
    border border-white rounded-xl bg-trade-blue-600
    w-screen h-screen">
    <h1 class="text-4xl font-black text-outline-blue mt-2">Sala de Espera</h1>
    <div class="flex justify-between items-center w-full bg-trade-red-500 h-28 rounded-xl px-5 border border-white">
      <UserPicture :src="myPlayer.avatar" />
      <div class="flex flex-col">
        <h1 class="text-3xl truncate w-full">{{ myPlayer.nickname }}</h1>
        <p>{{ randomSentence }}</p>
      </div>
    </div>
    <div class="flex flex-col w-full gap-y-4 max-h-[26rem] mb-20">
      <h2 class="text-2xl font-bold text-white">Jogadores na sala:</h2>
      <div class="flex w-full border-t-4 border-b-4 border-trade-blue-900 max-h-96 overflow-y-auto px-1">
        <ul class="flex flex-wrap">
          <li v-for="jogador in players" :key="jogador.id">
            <div :style="{ backgroundColor: jogador.color }" class="p-2 m-2 text-black flex flex-col items-center justify-center
            border rounded-xl border-trade-blue-900 w-[6rem] h-40">
              <UserPicture :src="jogador.avatar_url" class="user-picture-small" />
              <div class="flex w-full border-t-4 border-trade-blue-900 mt-2"></div>
              <div class="h-16 flex flex-col items-center justify-center">
                <p class="text-white flex-wrap">{{ jogador.nome }}</p>
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
      <button @click="startGame" class="border border-white rounded-full py-4 px-14 bg-trade-red-500 font-bold text-xl">
        Jogar
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