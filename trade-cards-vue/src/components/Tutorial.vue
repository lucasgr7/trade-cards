<script lang='ts' setup>
import { ref } from 'vue';

const showModal = ref(true);

function closeModal() {
  showModal.value = false;
}
</script>

<template>
  <div v-if="showModal" class="modal-overlay">
    <div class="modal-content text-center">
      <h2>Tutorial</h2>
      <p>Bem-vindo ao tutorial! Aqui você aprenderá como jogar.</p>
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
}
</style>