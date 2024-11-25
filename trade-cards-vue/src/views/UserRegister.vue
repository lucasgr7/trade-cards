<script lang='ts' setup>
import { onMounted } from 'vue';
import UserPicture from '@/components/UserPicture.vue';
import router from '@/util/router';
import { usePlayerStore } from '@/state/usePlayerStore';

// Utilizando a composable usePlayer
const store = usePlayerStore();

// Opcional: Atualizar avatar ao montar o componente se necessário
onMounted(() => {
  if (store.getMyself.seed === '') {
    router.push('/sessions');
  }
});

const handleSave = () => {
  router.push('/sessions');
}

</script>

<template>
  <div class="flex flex-col items-center justify-between p-4
  border border-white rounded-xl bg-trade-blue-100
  w-screen h-screen">
    <h2 class="text-2xl font-black text-white text-outline-blue mt-2 mb-2">Criação de personagem</h2>
    <UserPicture :src="store.getMyself.avatarUrl"/>
    <div class="flex flex-col items-start w-full gap-y-2 px-4">
      <p class="text-trade-blue-900">Nome</p>
      <input type="text" v-model="store.nickname" class="bg-white rounded-xl p-4 w-full text-trade-blue-900" placeholder="Insira um apelido">
    </div>
    <div class="flex flex-col">
      <button @click="store.generateAvatar" class="border border-trade-blue-700 rounded-xl py-10 px-10 mt-4 bg-trade-blue-700 font-bold
      active:bg-trade-blue-800">Gerar Avatar</button>
      <button :disabled="!store.getMyself.nickname" @click="handleSave"
      class="border border-trade-blue-700 rounded-xl py-10 px-4 mt-4 bg-trade-blue-700 font-bold
      disabled:opacity-50 disabled:bg-opacity-50">Salvar</button>
    </div>
    <p class="text-trade-blue-900 items-end mt-10">DiceBear gera aleatoriamente seu avatar a partir de um apelido.</p>
  </div>
</template>

<style scoped lang='scss'>
</style>