<script lang="ts" setup>
import { usePartidas } from '@/composables/apis/usePartidas';
import { usePartidaEvents } from '@/composables/game/usePartidaEvents';
import { usePlayerStore } from '@/state/usePlayerStore';
import { Partidas } from '@/type';
import { useRoute, useRouter } from 'vue-router';
import HeaderPage from '@/components/HeaderPage.vue';
import { computed, onMounted, ref } from 'vue';
import PlayerPill from '@/components/PlayerPill.vue';

const store = usePlayerStore();
const {isMyselfAdmin, nextTurn, subscribeToChanges, partida, initialize} = usePartidas(store.getMyself);
const router = useRouter();
const route = useRoute();
// GAME EVENTS
const {
  onLeaveGame,
} = usePartidaEvents();

subscribeToChanges(store.salaId, (callback: Partidas) => {
  if(callback.rodada_atual !== store.currentRodada){
    store.setCurrentRodada(callback.rodada_atual);
    store.clearBagOfCards();
    router.push(`/match/${store.salaId}`);
  }
})

const otherPlayersCommands = computed(() => {
  const acoes = partida.value?.acoes;
  // Remove the filter to include all players
  const currentRodadaAcoes = acoes?.filter((a) => a.round === store.currentRodada);
  
  // Sort by least time and then by highest weight
  return currentRodadaAcoes
    ?.sort((a, b) => {
    if (a.time !== b.time) {
      // Combine time and weight into a single value for sorting
      const combinedA = a.time + a.weight * 1000;
      const combinedB = b.time + b.weight * 1000;
      return combinedA - combinedB; // Sort by combined value
    }
    return b.weight - a.weight; // Higher
    })
    .map((a, index) => ({
      jogador: a.Jogador,
      command: a.command,
      ranking: index + 1, // Add ranking property
      time: a.time,
      weight: a.weight,
    }));
});

function formatTime(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  const formattedHours = hours % 24;
  const formattedMinutes = minutes % 60;
  const formattedSeconds = seconds % 60;

  return `${formattedHours}h ${formattedMinutes}m ${formattedSeconds}s`;
}

onMounted(async () => {
  // check if the match is the next rodada
  await initialize(route, router);
  if(partida.value?.rodada_atual !== store.currentRodada){
    store.setCurrentRodada(partida.value!.rodada_atual);
    store.clearBagOfCards();
    router.push(`/match/${store.salaId}`);
  }
})
</script>
<template>
  <div class="deck-table w-screen h-screen text-game">
  <HeaderPage :title="`Trade-Cards ${partida?.id ?? ''}`" @leaveGame="onLeaveGame" />
    <hr/>
    <div class="mt-2" v-for="(command, i) in otherPlayersCommands" :key="i">
      <player-pill :player="command.jogador" :ranking="command.ranking" 
      :isShining="store.getMyself.seed == command.jogador.seed"></player-pill>
      <div class="notebook text-playwrite-tz-guides-regular">
        {{ command.command.toLocaleLowerCase() }}
      </div>
    </div>
    <div class="flex flex-row">
      <button class="fill-gray-600" v-if="isMyselfAdmin" @click="nextTurn">Próximo turno</button>
    </div>
  </div>
  
</template>

<style scoped>
.notebook {
  background-color: #fff;
  border: 1px solid #ccc;
  padding: 20px;
  margin: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  font-family: 'Cursive', sans-serif;
  font-size: 1.2em;
  line-height: 1.5;
  border-radius: 10px;
  color: black;
  position: relative;
}
</style>