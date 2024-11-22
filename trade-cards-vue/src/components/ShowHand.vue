<script lang="ts" setup>
import { computed } from 'vue';
import Card from '@/components/Card.vue';
import { usePartidaEvents } from '@/composables/game/usePartidaEvents';

// props Partida: Partidas
const props = withDefaults(defineProps<{
  isMyselfAdmin: boolean | null
}>(), {
  isMyselfAdmin: false
});


const {
  selectedActionCard,
  selectedObjectCard,
  selectedConditionCard,
  onResetDeckBuilding } = usePartidaEvents();


// Computed para agrupar as cartas selecionadas
const selectedCards = computed(() => [
  selectedActionCard.value,
  selectedObjectCard.value,
  selectedConditionCard.value
]);

</script>

<template>
  <div class="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-75 p-4 overflow-auto">
    <div class="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 max-h-full overflow-y-auto">
      <Card v-for="(card, index) in selectedCards" :key="index" :image="card?.image ?? ''" :title="card?.nome ?? ''"
        :description="card?.descricao ?? ''" :type="card?.tipo ?? ''" class="w-64 h-auto sm:w-48" />
    </div>
    <button v-if="props.isMyselfAdmin"
      class="border text-black black-border rounded-full py-4 px-14 bg-trade-red-500 font-bold text-xl"
      @click="onResetDeckBuilding">
      Próximo Turno
    </button>
  </div>
</template>

<style scoped>
/* Ajuste os estilos conforme necessário */
button {
  transition: background-color 0.3s;
}

button:hover {
  background-color: #3b82f6;
  /* Cor de hover desejada */
}

.fixed {
  z-index: 50;
  /* Assegura que o overlay está acima de outros elementos */
}
</style>