<script lang='ts' setup>
import { usePlayerStore } from '@/state/usePlayerStore';

const store = usePlayerStore();
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  isHome: {
    type: Boolean,
    default: false
  }
})


const emit = defineEmits(['leaveGame'])

const handleLeaveGame = () => {
  emit('leaveGame')
}

</script>

<template>
  <div class="flex w-full text-xs items-center justify-between p-2 bg-bg-green text-white">
    Trade Cards <hr/> R: {{ store.currentRodada }} <hr/> {{props.title}}
  </div>
  <div class="flex w-full items-center justify-between p-2">
    
      <h1 class="text-base text-white font-black text-outline-blue">{{  }}</h1>
      <div class="flex gap-x-2 ml-4">
        <button @click="store.toggleFullscreen"
          class="text-trade-blue-900 border-2 border-black bg-trade-green-500 p-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4h16v16H4z" />
          </svg>
        </button>
        <button @click="handleLeaveGame" v-if="!isHome"
          class="text-trade-blue-900 border-2 border-black bg-trade-red-500 p-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
</template>

<style scoped lang='scss'>
    
</style>