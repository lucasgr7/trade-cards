<script lang='ts' setup>
import { useRouter } from 'vue-router';

const router = useRouter();

function leave() {
  router.push('/');
}

function selectDeck(deckName: string) {
  console.log(`O baralho escolhido foi: ${deckName}`);
}

</script>

<template>
  <div class="flex flex-col items-center justify-between p-4
    border border-white rounded-xl bg-trade-blue-100
    w-screen h-screen">
    <div class="flex w-full items-center ">
      <button @click="leave" class="absolute top-4 right-0 mb-4 mr-1 text-trade-blue-900 border-2 border-black bg-trade-red-500 p-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <h1 class="text-3xl font-black text-outline-blue mb-8 ml-4">Escolha seu baralho</h1>
    </div>
    <div class="flex flex-col">
      <div class="px-16">
        <div class="h-[300px] w-[210px] mb-2" @click="selectDeck('Baralho-Sol')">
          <img src="@/assets/baralho-sol.png" alt="Baralho-Sol">
        </div>
        <div class="flex justify-between pt-1 pb-8">
          <div class="flex items-center border border-black rounded-full px-4 bg-yellow-300">
            <img src="@/assets/icons/energy.png" class="h-10 w-10 pr-2 border-0 border-r-2 border-black" alt="Energia">
            <p class="text-black ml-4">5</p>
          </div>
          <div class="flex items-center border border-black rounded-full px-4 bg-blue-300">
            <img src="@/assets/icons/joker.png" class="h-10 w-10 pr-2 border-0 border-r-2 border-black" alt="Coringas">
            <p class="text-black ml-4">2</p>
          </div>
        </div>
      </div>
      <div class="border-0 border-t-2 px-16 pt-12 border-black">
        <div class="h-[300px] w-[210px] mb-2" @click="selectDeck('Baralho-Lua')">
          <img src="@/assets/baralho-lua.png" alt="Baralho-Lua">
        </div>
        <div class="flex justify-between pt-2 pb-2">
          <div class="flex items-center border border-black rounded-full px-4 bg-yellow-300">
            <img src="@/assets/icons/energy.png" class="h-10 w-10 pr-2 border-0 border-r-2 border-black" alt="Energia">
            <p class="text-black ml-4">3</p>
          </div>
          <div class="flex items-center border border-black rounded-full px-4 bg-blue-300">
            <img src="@/assets/icons/joker.png" class="h-10 w-10 pr-2 border-0 border-r-2 border-black" alt="Coringas">
            <p class="text-black ml-4">5</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang='scss'>
    
</style>