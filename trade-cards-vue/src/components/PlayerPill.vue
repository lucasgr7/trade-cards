<script lang="ts" setup>
import { Jogador } from '@/type';
import { PropType } from 'vue';


const props = defineProps({
  player: {
    type: Object as PropType<Jogador>,
    required: true
  },
  isShining: {
    type: Boolean,
    default: false
  },
  ranking: {
    type: Number,
    default: 0
  }
})
</script>
<template>
<div class="player-pill w-40" :class="{ 'shining': isShining, 'inverted': isShining }">
  <img :src="player.avatarUrl" alt="Player Image" class="player-image" /> 
  <span class="player-name">{{ player.nickname }} <p class="text-red-500">{{ props.ranking }}</p></span>
</div>
</template>

<style scoped>
.player-pill {
  display: flex;
  align-items: center;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 4px 8px;
  font-family: 'Press Start 2P', cursive;
}

.player-image {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 8px;
}

.player-name {
  font-size: 12px;
  color: #333;
}

.shining {
  animation: shine 2s infinite;
}

.inverted {
  filter: invert(1);
}

@keyframes shine {
  0% {
    box-shadow: 0 0 5px rgb(1, 121, 233);
  }
  50% {
    box-shadow: 0 0 20px rgb(1, 121, 233);
  }
  100% {
    box-shadow: 0 0 5px rgb(180, 214, 245);
  }
}

.player-pill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 100%;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.3);
  transform: skewX(-45deg);
  filter: blur(5px);
  opacity: 0.7;
  pointer-events: none;
}
</style>