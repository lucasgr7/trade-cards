<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps<{
  src: string
}>()
</script>

<template>
  <div class="picture-frame">
    <img :src="src" class="round-image" />
  </div>
</template>

<style scoped>
.picture-frame {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 150px;
  height: 150px;
  border: 2px solid #ccc;
  border-radius: 50%;
  overflow: hidden;
  border-width: 4px;
  border-color: white;
}

.round-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}
</style>