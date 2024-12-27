<script lang='ts' setup>
import { useLocalStorage } from '@vueuse/core';
import { onMounted, ref } from 'vue';

const showModal = ref(true);
// useLocalStorage
const isShow = useLocalStorage('showModal', 0);

function closeModal() {
  showModal.value = false;
}
onMounted(() => {
  isShow.value += 1;
})
</script>

<template>
  <div v-if="showModal" class="modal-overlay text-white!">
    <div class="modal-content text-center flex flex-col p-8 rounded-lg flex justify-center items-center">
      <img src="/v2/swipe-up.gif" alt="Tutorial" class="w-16 align-middle bg-transparent rounded-lg" />
      <p>Selecionar carta</p>
      <img class="w-16 align-middle bg-transparent  mt-12 rounded-lg" src="/v2/touch.gif" alt="Tutorial" />
      <p>Descartar</p>
      <button @click="closeModal" class="bg-white py-4 px-10 text-black mt-4">OK</button>
    </div>
  </div>
</template>

<style scoped lang='scss'>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.75); // 75% de transparência
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  color:white;
}
</style>