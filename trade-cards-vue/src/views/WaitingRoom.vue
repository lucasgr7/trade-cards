<script lang='ts' setup>
import { onMounted, ref, watch } from 'vue';
import UserPicture from '@/components/UserPicture.vue';
import { useSalas } from '@/composables/apis/useSalas';
import { useRoute } from 'vue-router';
import router from '@/util/router';
import { usePartidas } from '@/composables/apis/usePartidas';
import { Partidas, Jogador } from 'type';
import { usePlayerStore } from '@/state/usePlayerStore';
import HeaderPage from '@/components/HeaderPage.vue';
import { EnumStatusPartida } from '@/enums/statusMatch';
import Alert from '@/components/Alert.vue';

const store = usePlayerStore();;
const { updateRecord,
  getPlayersFromSession,
  sala,
  players,
  isMyselfCreatorSession,
  showAlert, alertMessage } = useSalas(store.getMyself);
const { insertRecord, partida, initialize } = usePartidas(store.getMyself);

const route = useRoute();

const sentences = [
  "Tá cansado de esperar",
  "Quer trocar presentes",
  "Acha que não vai dar bom",
  "Tá querendo beber depois do jogo",
  "Tá impaciente",
  "Quer jogar logo",
  "Não quer ganhar meias",
  "Quer trocar figurinhas",
  "Roubou pão na Casa do João",
  "Quer saber quem ficou na churrasqueira!",
  "o ILUMINADO",
  "Quer o presente maior",
  "Vai começar uma dieta em 2025",
  "Vai entrar na academia em 2025",
];
const randomSentence = ref('');
const initialized = ref(false);

async function startGame() {
  // what data do we need to start the game?
  if(!sala.value) return;
  const match: Partidas = {
    sala_id: sala.value?.id as number,
    jogadores: sala.value?.jogadores || [],
    estado: EnumStatusPartida.WAITINGSTATUS,
    acoes: [],
    cartas_disponiveis: '',
    rodada_atual: 0,
  };

  // insert the match in the database
  await updateRecord(sala.value.id as number, { ...sala.value, estado: EnumStatusPartida.WAITINGSTATUS });
  await insertRecord(match);
}

async function leave() {
  if (!sala.value) return;

  const playerIndex = sala.value.jogadores.findIndex((jogador: Jogador) => jogador.nickname === store.getMyself.nickname);
  if (playerIndex === -1) {
    store.showAlertMessage('Jogador não encontrado na sala.');
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

function pickDeck() {
  router.push(`/pick-deck/${sala.value?.id}`);
}

function handleButtonStartGame() {
  if (isMyselfCreatorSession) {
    pickDeck();
  } else {
    getRandomSentence();
  }
}

watch(() => sala.value, (newValue) => {
  if(initialized.value || partida.value != null) return;
  if (newValue?.estado === EnumStatusPartida.INITSTATUS) {
    router.push(`/match/${sala.value?.id}`);
  }
  else if(isMyselfCreatorSession){
    console.log('isMyselfCreatorSession', isMyselfCreatorSession);
    console.log('sala.value', sala.value);
    console.log('starting the game');
    startGame();
  }
  initialized.value = true;
});

onMounted(async () => {
  await initialize(route, router);
  getRandomSentence();
  getPlayersFromSession(route.params.id);
  const salaId = route.params.id;
  store.setSalaId(Number(salaId));
});

</script>

<template>
  <div class="flex flex-col items-center justify-between p-4
    border border-white rounded-xl bg-trade-blue-600 text-game w-screen h-screen">
    <HeaderPage title="Sala de Espera" @leaveGame="leave"/>
    <div class="min-w-[10rem]">
      <UserPicture :src="store.getMyself.avatarUrl"/>
    </div>
    <div class="w-[20rem] bg-trade-red-500 h-24 rounded-xl px-5 border border-black
      flex flex-col text-black text-center justify-center items-center">
      <h1 class="text-base truncate text-ellipsis">{{ store.getMyself.nickname }}</h1>
      <p class="text-xs">{{ randomSentence }}</p>
    </div>
    <div class="flex flex-col w-full gap-y-4 max-h-[26rem] mb-12">
      <h2 class="text-xs text-center font-bold text-white">Jogadores na sala:</h2>
      <div class="flex w-full border-t-4 border-b-4 border-trade-blue-900 max-h-96 overflow-y-auto px-1">
        <ul class="flex flex-wrap">
          <li v-for="jogador in players" :key="jogador.seed">
            <div :style="{ backgroundColor: jogador?.color }" class="p-2 m-2 text-black flex flex-col items-center justify-center
            border rounded-xl border-trade-blue-900 w-[6rem] h-40">
              <UserPicture :src="jogador.avatarUrl || ''" class="user-picture-small" />
              <div class="flex w-full border-t-4 border-trade-blue-900 mt-2"></div>
              <div class="h-16 flex flex-col items-center justify-center text-center">
                <p class="text-white flex-wrap text-xs">{{ jogador.nickname }}</p>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <button @click="handleButtonStartGame"
      class="border border-white rounded-full py-4 px-14 bg-trade-red-500 font-bold text-xs text-black">
      {{ isMyselfCreatorSession ? 'Escolher Baralho' : 'Acelerar início' }}
    </button>
    <Alert v-if="showAlert" :message="alertMessage" @close="showAlert = false" />
  </div>
</template>

<style scoped lang='scss'>
.user-picture-small {
  width: 75px;
  height: 75px;
}
</style>