<script lang='ts' setup>
import { onMounted } from 'vue';
import UserPicture from '@/components/UserPicture.vue';
import router from '@/util/router';
import { usePlayerStore } from '@/state/usePlayerStore';
import HeaderPage from '@/components/HeaderPage.vue';
import Footer from '@/components/Footer.vue';

// Utilizando a composable usePlayer
const store = usePlayerStore();
const footerMsg = "DiceBear gera aleatoriamente seu avatar a partir de um apelido.";

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
  <div class="flex flex-col items-center justify-between p-4 text-game text-center
    border border-white rounded-xl bg-trade-blue-100 w-screen h-screen">
    <HeaderPage title="Criação de personagem" :isHome="true"/>
    <UserPicture :src="store.getMyself.avatarUrl"/>
    <div class="flex flex-col items-start w-full gap-y-2 px-4">
      <p class="text-trade-blue-900">Nome</p>
      <input type="text" v-model="store.nickname" class="bg-white rounded-xl p-4 w-full text-trade-blue-900 text-xs text-center" placeholder="Insira um apelido">
    </div>
    <div class="flex flex-col">
      <button @click="store.generateAvatar" class="border border-black rounded-xl py-10 px-10 mt-4 bg-trade-blue-200 font-bold
      active:bg-trade-blue-400">Gerar Avatar</button>
      <button :disabled="!store.getMyself.nickname" @click="handleSave"
      class="border border-black rounded-xl py-10 px-4 mt-4 bg-trade-blue-200 font-bold
      disabled:opacity-50 disabled:bg-opacity-85">Salvar</button>
    </div>
    <Footer :message="footerMsg" />
  </div>
</template>

<style scoped lang='scss'>
</style>