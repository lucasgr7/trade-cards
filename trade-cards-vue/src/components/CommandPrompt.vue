<script lang="ts" setup>
import { usePlayerStore } from '@/state/usePlayerStore';
import { defineProps, ref, watch } from 'vue';

const props = defineProps<{
  show: boolean;
  command: string;
  ranking: string;
}>();

const store = usePlayerStore();
const selectedCommand = ref<string | null>(null);

const emits = defineEmits<{
  'update:show': [boolean];
  accept: [];
  'try-again': [];
  'update:command': [string];
}>();

const closeModal = () => {
  emits('update:show', false);
};

const accept = () => {
  if (selectedCommand.value) {
    emits('update:command', selectedCommand.value);
  }
  emits('accept');
  closeModal();
};

const tryAgain = () => {
  emits('try-again');
  closeModal();
};

const chooseCommand = (command: string) => {
  selectedCommand.value = command;
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
      <div class="flex justify-between">
        <slot name="header">
          <h2 class="text-base text-black text-game font-bold">Comando Gerado</h2>
        </slot>
        <button  @click="closeModal"
          class="text-trade-blue-900 border-2 border-black bg-trade-red-500">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div class="mt-5 text-center text-game" v-if="store.listOfCommands.length > 1">
        <h2 class="text-base font-bold text-black">Opções anteriores:</h2>
        <div v-for="(command, index) in store.listOfCommands.slice(0, -1)" :key="index" @click="chooseCommand(command)">
          <p class="mt-2 text-game text-[0.7rem] text-black bg-gray-300 border border-black p-2" :class="{'bg-blue-200': selectedCommand === command}">
            {{ command }}
          </p>
        </div>
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