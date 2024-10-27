<script lang='ts' setup>
import { useRouter } from 'vue-router';
import { Salas, useSalas } from '@/composables/useSalas';
import { ref } from 'vue';
import { usePlayer } from '@/composables/usePlayer';

const router = useRouter();
const { insertRecord, getRecords, records } = useSalas();
const { getMyself } = usePlayer();

const sessionName = ref('');
const sessionNameError = ref('');

async function createSession(event: Event) {
  event.preventDefault();

  if (!sessionName.value) {
    sessionNameError.value = 'Nome da sala é obrigatório.';
    return;
  }

  try {
    var myself = await getMyself.value;
    myself.creator = true;
    const newSession: Salas = {
      name: sessionName.value,
      jogadores: [myself],
      estado: 1,
    };

    await insertRecord(newSession);
    await getRecords();
    var sala = records.value?.filter((sala: Salas) => sala.name === sessionName.value)[0];

    if (!sala) {
      alert('Erro ao criar a sala.');
      return;
    }
    router.push(`/waiting-room/${sala.id}`);
  } catch (error: any) {
    alert('Erro ao criar a sala: ' + error.message);
    return;
  }

}

function cancel() {
  router.push('/sessions');
}
</script>

<template>
  <div class="flex flex-col justify-between p-4
    border border-white rounded-xl bg-trade-blue-100
    w-screen h-screen">
    <h1 class="text-4xl font-black text-outline-blue mt-10">Criar Sala</h1>
    <img src="@/assets/icons/world.png" alt="Logo" class="w-3/4 h-60 mx-auto">
    <form @submit="createSession($event)">
      <div class="flex flex-col gap-y-4">
        <input type="text" placeholder="Nome da sala" v-model="sessionName"
          class="w-full p-2 bg-white text-trade-blue-900 border border-trade-blue-900 rounded-full text-center">
        <span v-if="sessionNameError" class="absolute text-red-600 text-sm bottom-[77px] left-[110px]">
          {{ sessionNameError }}
        </span>
        <div class="flex justify-between gap-x-4">
          <button type="submit"
            class="w-full p-6 bg-trade-blue-800 text-white border border-trade-blue-900 rounded-full text-center">
            Criar Sala
          </button>
          <button type="button" @click="cancel"
            class="w-full p-2 bg-gray-500 text-white border border-trade-blue-900 rounded-full text-center">
            Cancelar
          </button>
        </div>
      </div>
    </form>
    <p class="text-trade-blue-900">Defina um nome para a sala de trade.</p>
  </div>
</template>

<style scoped lang='scss'></style>