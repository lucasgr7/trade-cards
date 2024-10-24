<script lang='ts' setup>
import { onMounted, ref } from 'vue';
import UserPicture from '../components/UserPicture.vue';
import { useRouter } from 'vue-router';

const seed = ref('');
const avatarUrl = ref('');
const nickname = ref('');
const router = useRouter();

function generateRandomSeed() {
  return Math.random().toString(36).substring(7);
}

function getAvatarUrl(seed: string) {
  return `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${seed}`;
}

function generateAvatar() {
  seed.value = generateRandomSeed();
  avatarUrl.value = getAvatarUrl(seed.value);
}

// Local storage functions
function saveUserData(seed: string, avatarUrl: string, nickname: string) {
  localStorage.setItem('userSeed', seed);
  localStorage.setItem('avatarUrl', avatarUrl);
  localStorage.setItem('nickname', nickname);
  router.push('/sessions');
}

function loadUserData() {
  const seed = localStorage.getItem('userSeed');
  const avatarUrl = localStorage.getItem('avatarUrl');
  return { seed, avatarUrl };
}

onMounted(() => {
  const userData = loadUserData();
  if (userData.seed && userData.avatarUrl) {
    seed.value = userData.seed;
    avatarUrl.value = userData.avatarUrl;
  } else {
    generateAvatar();
  }
});

</script>

<template>
  <div class="flex flex-col items-center justify-between p-4
  border border-white rounded-xl bg-trade-blue-100
  w-screen h-screen">
    <h2 class="text-3xl font-black text-white text-outline-blue mt-5">Criação de personagem</h2>
    <UserPicture :src="avatarUrl"/>
    <h2 class="text-lg text-trade-blue-900 font-bold">Avatar</h2>
    <div class="flex flex-col items-start w-full gap-y-2 px-4">
      <p class="text-trade-blue-900">Nome</p>
      <input type="text" v-model="nickname" class="bg-white rounded-xl p-4 w-full text-trade-blue-900" placeholder="Insira um apelido">
    </div>
    <div class="flex flex-col">
      <div class="border border-trade-blue-700 rounded-xl py-10 px-10 mt-4 bg-trade-blue-700 font-bold">
        <button @click="generateAvatar">Gerar Avatar</button>
      </div>
      <button :disabled="!nickname" @click="saveUserData(seed, avatarUrl, nickname)"
      class="border border-trade-blue-700 rounded-xl py-10 px-4 mt-4 bg-trade-blue-700 font-bold
      disabled:opacity-50 disabled:bg-opacity-50">Salvar</button>
    </div>
    <p class="text-trade-blue-900 items-end mt-10">DiceBear gera aleatoriamente seu avatar a partir de um apelido.</p>
  </div>
</template>

<style scoped lang='scss'>
</style>