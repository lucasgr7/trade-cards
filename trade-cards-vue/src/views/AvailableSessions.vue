<script lang='ts' setup>
import { onMounted, ref } from 'vue';
import { Salas, useSalas } from '@/composables/apis/useSalas';
import onlineIcon from '@/assets/icons/online_session.png';
import offlineIcon from '@/assets/icons/offline_session.png';
import { useRouter } from 'vue-router';
import { Jogador } from 'type';
import { usePlayerStore } from '@/state/usePlayerStore';
import HeaderPage from '@/components/HeaderPage.vue';
import Footer from '@/components/Footer.vue';
import { EnumStatusPartida } from '@/enums/statusMatch';

const { records, getPlayersCount, getSessionsCount, deleteOldRecords, updateRecord } = useSalas();
const { getMyself } = usePlayerStore();
const router = useRouter();
const footerMsg = 'Selecione uma sala online ou crie a sua própria.';

const selectedSession = ref<Salas | null>(null);

onMounted(() => {
  deleteOldRecords();
})

function selectSession(session: Salas) {
  selectedSession.value = session;
}

async function joinSession() {
  if (!selectedSession.value) return;

  const player = getMyself

  if (!player.avatarUrl || !player.nickname) {
    alert('Dados do jogador não encontrados.');
    return;
  }

  if (selectedSession.value.jogadores.find((jogador: Jogador) => jogador.nickname === player.nickname)) {
    alert('Jogador já está na sala.');
    return;
  }

  if (selectedSession.value.estado == EnumStatusPartida.INITSTATUS) {
    alert('Aqui não dá pra entrar, a partida já começou!');
    return;
  }

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
  <div class="flex flex-col items-center justify-between p-4 text-game
      border border-white rounded-xl bg-trade-blue-100 w-screen h-screen">
    <HeaderPage title="Salas disponíveis" @leaveGame="leave"/>
    <span class="text-trade-blue-900 text-sm border bg-white rounded-full p-2 w-12 text-center">{{ getSessionsCount() }}</span>
    <div class="text-trade-blue-900 bg-trade-blue-100 border-4 rounded-2xl border-trade-blue-900 border-b-0 my-2">
      <div class="max-h-96 overflow-y-auto max-w-80">
        <table class="w-20 text-[0.5rem]">
          <thead class="bg-trade-blue-100 sticky top-0 z-10">
            <tr>
              <th class="py-5 px-6 border-b-2 border-trade-blue-900">Sala</th>
              <th class="py-5 px-6 border-b-2 border-trade-blue-900">Jogadores</th>
              <th class="py-5 px-6 border-b-2 border-trade-blue-900">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="session in records" :key="session.id" @click="selectSession(session)"
              :class="{ 'bg-trade-blue-50': selectedSession && selectedSession.id === session.id }">
              <td class="py-5 px-7 border-b-2 border-trade-blue-900">{{ session.name }}</td>
              <td class="py-5 px-7 border-b-2 border-trade-blue-900">{{ getPlayersCount(session) }}</td>
              <td class="py-5 px-7 border-b-2 border-trade-blue-900 pl-10">
                <img :src="session.estado === EnumStatusPartida.WAITINGSTATUS ? onlineIcon : offlineIcon" alt="Status Icon" class="w-6 h-6" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="flex flex-col gap-y-2">
      <button @click="joinSession" :disabled="!selectedSession" class="border border-black rounded-full py-4 px-16 bg-trade-blue-600 font-bold text-xs
          disabled:opacity-50">
          Entrar
        </button>
      <button @click="createSession"
        class="border border-black rounded-full py-4 px-16 bg-trade-blue-800 font-bold text-xs">
        Criar Sala
      </button>
    </div>
    <Footer :message="footerMsg" />
  </div>
</template>

<style scoped lang='scss'></style>
