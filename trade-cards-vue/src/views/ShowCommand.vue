<script lang="ts" setup>
import { usePartidas } from '@/composables/apis/usePartidas';
import { usePartidaEvents } from '@/composables/game/usePartidaEvents';
import { usePlayerStore } from '@/state/usePlayerStore';
import { Partidas } from '@/type';
import { useRoute, useRouter } from 'vue-router';
import HeaderPage from '@/components/HeaderPage.vue';
import { computed, onMounted } from 'vue';
import PlayerPill from '@/components/PlayerPill.vue';
import { useCompositionEmojifier } from '@/composables/utils/useCompositionEmojifier';
import Pill from '@/components/Pill.vue';

const store = usePlayerStore();
const {isMyselfAdmin, nextTurn, subscribeToChanges, partida, initialize} = usePartidas(store.getMyself);
const router = useRouter();
const route = useRoute();
const {compositionDescription} = useCompositionEmojifier();

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

const allPlayerCommands = computed(() => {
  const acoes = partida.value?.acoes;
  // Remove the filter to include all players
  const currentRodadaAcoes = acoes?.filter((a) => a.round === store.currentRodada);
  
  // Sort by least time and then by highest weight
  return currentRodadaAcoes!
    .map((a, index) => ({
      jogador: a.Jogador,
      command: a.command,
      ranking: index + 1, // Add ranking property
      time: a.time,
      weight: a.weight,
    }));
});

const commandAppendedEmoji = (command: string) => {
  // remove commas
  const commandsForSplit = command.split(/,/g);

  // the first commmand would have appended the action and the object, we should remove the words 'trocar', 'presente', 'assento' and 'revelear'

  // remove double commas like ', ,'
  commandsForSplit.forEach((c, i) => {
    if(c.trim() === ''){
      commandsForSplit.splice(i, 1);
    }
  });
  

  const firstCommand = commandsForSplit[0].toLocaleLowerCase().split(' ').filter((c) => !['troque', 'presente', 'assento', 'revelar'].includes(c)).join(' ');
  commandsForSplit[0] = firstCommand;
  return commandsForSplit.map((c) => compositionDescription(c)).join('<br/> ');
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
  <div class="flex flex-col justify-center items-center w-screen text-game overflow-y-auto">
  <HeaderPage :title="`Trade-Cards ${partida?.id ?? ''}`" @leaveGame="onLeaveGame" />
    <div class="mt-4 w-screen" v-for="(command, i) in allPlayerCommands" :key="i">
      <player-pill :player="command.jogador" :ranking="command.ranking" 
      :isShining="store.getMyself.seed == command.jogador.seed"></player-pill>
      <div class="notebook" >
        <Pill :command="command.command" />
        <span v-html="commandAppendedEmoji(command.command)"></span>
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
  padding: 0.5rem;
  margin: 0.5rem;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
  font-family: sans-serif;
  font-size: 1.2em;
  line-height: 1.5;
  border-radius: 0px;
  color: black;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>