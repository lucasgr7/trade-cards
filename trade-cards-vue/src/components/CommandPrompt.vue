<script lang="ts" setup>
import { defineProps, watch } from 'vue';

const props = defineProps<{
  show: boolean;
  command: string;
  ranking: string;
}>();

const emits = defineEmits<{
  'update:show': [boolean];
  accept: [];
  'try-again': [];
}>();
const closeModal = () => {
  emits('update:show', false);
};

const accept = () => {
  emits('accept');
  closeModal();
};

const tryAgain = () => {
  emits('try-again');
  closeModal();
};

watch(() => props.show, (newVal) => {
  if (newVal) {
    // Logic to handle when the modal should be shown

  }
});

</script>
<template>
  <div v-show="props.show" class="fixed inset-0 z-10 flex items-center justify-center bg-gray-800 bg-opacity-75">
    <div class="bg-white rounded-lg shadow-lg p-6">
      <div class="flex justify-evenly">
        <slot name="header">
          <h2 class="text-sm text-black text-game font-bold">Comando Gerado</h2>
        </slot>
        <button class="text-gray-500 hover:text-gray-700" @click="closeModal">X</button>
      </div>
      <div class="mt-4">
        <h2 class="text-xs flex-shrink font-bold">Ranking</h2>
        <p class="mt-2 text-game text-sm text-black">{{ props.ranking }}</p>
      </div>
      <div class="mt-4">
        <h2 class="text-2xl font-bold">Command Prompt</h2>
        <p class="mt-2 text-game text-sm text-black">{{ props.command }}</p>
      </div>
      <div class="mt-6 flex justify-end space-x-4">
        <button class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" @click="accept">Accept</button>
        <button class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600" @click="tryAgain">Try Again</button>
      </div>
    </div>
  </div>
</template>