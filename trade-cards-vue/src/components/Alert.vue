<script lang='ts' setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

const emit = defineEmits();

const closeModal = () => {
  emit('close');
};

</script>

<template>
  <div class="modal-container text-black z-50">
    <div class="modal-content flex flex-col gap-y-6 items-center text-center">
      <p class="text-xl">Alerta</p>
      <p>{{ props.message }}</p>
      <button @click="closeModal" class="bg-blue-400 py-4 px-10 border-black">OK</button>
    </div>
  </div>
</template>

<style scoped lang='scss'>
.modal-container {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  animation: fadeIn 0.5s;
}

.modal-content {
  background-color: #f8d7da;
  padding: 20px;
  border-radius: 10px;
  border: 1px solid black;
  animation: slideUp 0.5s;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}
    
</style>