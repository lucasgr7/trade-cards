<script lang='ts' setup>
import { useRouter } from 'vue-router';
import { Salas, useSalas } from '@/composables/apis/useSalas';
import { onMounted, ref } from 'vue';
import { usePlayerStore, alertMessage, showAlert } from '@/state/usePlayerStore';
import HeaderPage from '@/components/HeaderPage.vue';
import Footer from '@/components/Footer.vue';
import { EnumStatusPartida } from '@/enums/statusMatch';
import Alert from '@/components/Alert.vue';

const router = useRouter();
const { insertRecord, getRecords, records } = useSalas();
const store = usePlayerStore();
const footerMsg = 'Defina um nome para a sala de trade.';

const sessionName = ref('');
const sessionNameError = ref('');

async function createSession(event: Event) {
  event.preventDefault();

  if (!sessionName.value) {
    sessionNameError.value = 'Nome da sala é obrigatório.';
    return;
  }

  try {
    store.setAsCreator();
    const newSession: Salas = {
      name: sessionName.value,
      jogadores: [store.getMyself],
      estado: EnumStatusPartida.WAITINGSTATUS,
    };

    await insertRecord(newSession);
    await getRecords();
    var sala = records.value?.filter((sala: Salas) => sala.name === sessionName.value)[0];

    if (!sala) {
      store.showAlertMessage('Erro ao criar a sala.');
      return;
    }
    router.push(`/waiting-room/${sala.id}`);
  } catch (error: any) {
    store.showAlertMessage('Erro ao criar a sala: ' + error.message);
    return;
  }
}

function cancel() {
  router.push('/sessions');
}

onMounted(() =>{
  // give focus to the input
  document.querySelector('input')?.focus();
})
</script>

<template>
  <div class="flex flex-col justify-between p-4 text-game text-center
    border border-white rounded-xl bg-trade-blue-100
    w-screen h-screen">
    <HeaderPage title="Criar Sala" @leaveGame="cancel"/>
    <form @submit="createSession($event)">
      <input type="text" placeholder="Nome da sala" v-model="sessionName"
      class="w-full p-3 bg-white text-trade-blue-900 border mb-12 border-trade-blue-900 rounded-full text-sm text-center" />
      <img src="@/assets/icons/world.png" alt="Logo" class="w-3/4 h-60 mx-auto">
      <div class="flex flex-col gap-y-4">
        <span v-if="sessionNameError" class="absolute text-red-600 text-sm bottom-[77px] left-[110px]">
          {{ sessionNameError }}
        </span>
        <button type="submit"
          class="w-full p-4 mt-12 bg-trade-blue-800 text-white border border-trade-blue-900 rounded-full text-center text-xs">
          Criar Sala
        </button>
      </div>
    </form>
    <Footer :message="footerMsg" />
    <Alert v-if="showAlert" :message="alertMessage" @close="showAlert = false" />
  </div>
</template>

<style scoped lang='scss'></style>