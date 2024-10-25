<script lang='ts' setup>
import { onMounted, ref } from 'vue';
import { Salas, useSalas } from '@/composables/useSalas';
import onlineIcon from '@/assets/icons/online_session.png';
import offlineIcon from '@/assets/icons/offline_session.png';
import { useRouter } from 'vue-router';
import { usePlayer } from '@/composables/usePlayer';

const { records, getPlayersCount, getSessionsCount, deleteOldRecords, updateRecord } = useSalas();
const { getMyself } = usePlayer();
const router = useRouter();

const selectedSession = ref<Salas | null>(null);

onMounted(() => {
  deleteOldRecords();
})

function selectSession(session: Salas) {
  selectedSession.value = session;
}

async function joinSession() {
  if (!selectedSession.value) return;

  const player = getMyself.value

  if (!player.avatarUrl || !player.nickname) {
    alert('Dados do jogador não encontrados.');
    return;
  }

  // TODO: Check if player is already in the room

  selectedSession.value.jogadores.push(player);

  try {
    await updateRecord(selectedSession.value.id as number, selectedSession.value);
    router.push({ name: 'WaitingRoom', params: { id: selectedSession.value.id } });
  } catch (error: any) {
    alert('Erro ao entrar na sala: ' + error.message);
  }
}

function createSession() {
  router.push('/create-session');
}

function leave() {
  selectedSession.value = null;
  router.push('/');
}

</script>

<template>
  <div class="flex flex-col items-center justify-between p-4
    border border-white rounded-xl bg-trade-blue-100
    w-screen h-screen">
    <div class="flex flex-col w-full items-center justify-center mt-4 gap-y-4">
      <button @click="leave" class="absolute top-1 right-0 mb-4 mr-1 text-trade-blue-900 border-2 border-black bg-trade-red-500 p-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <h1 class="text-4xl font-black text-outline-blue mt-4">Salas disponíveis</h1>
      <span class="text-trade-blue-900 text-4xl">{{ getSessionsCount() }}</span>
    </div>
    <div class="text-trade-blue-900 bg-trade-blue-100 border-4 rounded-2xl border-trade-blue-900 border-b-0">
      <div class="max-h-96 overflow-y-auto">
        <table class="w-20">
          <thead class="bg-trade-blue-100 sticky top-0 z-10">
            <tr>
              <th class="py-5 px-7 border-b-2 border-trade-blue-900">Sala</th>
              <th class="py-5 px-7 border-b-2 border-trade-blue-900">Jogadores</th>
              <th class="py-5 px-7 border-b-2 border-trade-blue-900">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="session in records" :key="session.id" @click="selectSession(session)"
              :class="{ 'bg-trade-blue-50': selectedSession && selectedSession.id === session.id }">
              <td class="py-5 px-7 border-b-2 border-trade-blue-900">{{ session.name }}</td>
              <td class="py-5 px-7 border-b-2 border-trade-blue-900">{{ getPlayersCount(session) }}</td>
              <td class="py-5 px-7 border-b-2 border-trade-blue-900 pl-10">
                <img :src="session.estado === 1 ? onlineIcon : offlineIcon" alt="Status Icon" class="w-6 h-6" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="flex flex-col gap-y-2">
      <button @click="joinSession" :disabled="!selectedSession" class="border border-black rounded-full py-4 px-16 bg-trade-blue-600 font-bold text-xl
          disabled:opacity-50">
          Entrar
        </button>
      <button @click="createSession"
        class="border border-black rounded-full py-4 px-16 bg-trade-blue-800 font-bold text-xl">
        Criar Sala
      </button>
    </div>
    <p class="text-trade-blue-900">Selecione uma sala online ou crie a sua própria.</p>
  </div>
</template>

<style scoped lang='scss'></style>
