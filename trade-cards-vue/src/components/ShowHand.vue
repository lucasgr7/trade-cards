<script lang="ts" setup>
import { computed } from 'vue';
import Card from '@/components/Card.vue';
import { useRouter } from 'vue-router';
import { usePartidaEvents } from '@/composables/game/usePartidaEvents';

const {
  selectedActionCard,
  selectedObjectCard,
  selectedConditionCard } = usePartidaEvents();
const router = useRouter();

// Computed para agrupar as cartas selecionadas
const selectedCards = computed(() => [
  selectedActionCard.value,
  selectedObjectCard.value,
  selectedConditionCard.value
]);

// Função para limpar as seleções e voltar para a partida
function voltarParaPartida() {
  selectedActionCard.value = null;
  selectedObjectCard.value = null;
  selectedConditionCard.value = null;
}
</script>

<template>
  <div class="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-75 p-4 overflow-auto">
    <div class="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 max-h-full overflow-y-auto">
      <Card v-for="(card, index) in selectedCards" :key="index" :image="card!.image" :title="card!.nome"
        :description="card!.descricao" :type="card!.tipo" class="w-64 h-auto sm:w-48" />
    </div>
    <button @click="voltarParaPartida" class="mt-8 px-4 py-2 bg-trade-blue-500 text-white rounded">
      Voltar
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