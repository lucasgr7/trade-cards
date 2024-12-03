<script lang='ts' setup>
import { CartasType } from '@/type';

const props = defineProps<{
  cartas?: CartasType[]
}>();

const emit = defineEmits(['removerCartaEscolhida']);

const removeCarta = (card: any) => {
  emit('removerCartaEscolhida', card);
};

</script>

<template>
  <div class="border-2 border-b-4 border-black p-4 w-[20rem] h-[9rem] rounded-lg bg-green-200 text-black 
      mt-2 mb-4 flex flex-wrap gap-2 overflow-y-auto flex-shrink leading-snug">
    <div v-for="(carta, index) in props.cartas" :key="index" @click="removeCarta(carta)"
      :class="['card', `${carta.type.toLowerCase()}-card`, 'border p-2 rounded-lg bg-white border-black h-fit text-game text-xs']">
      {{ carta.nome }}
    </div>
  </div>
</template>

<style scoped lang='scss'>
.action-card {
  background: linear-gradient(135deg, #61c5ff, #a2d2ff);
}

.object-card {
  background: linear-gradient(135deg, #ffb1a3, #ff6347);
}

.condition-card {
  background: linear-gradient(135deg, #51d85c, #a0ffa0);
}

.connection-card {
  background: linear-gradient(135deg, #f7d154, #f7f754);
}

.color-card {
  background: linear-gradient(135deg, #a35ff7, #d2a2ff);
}

.joker-card {
  background: linear-gradient(135deg, #fcfcfc, #cecece);
}
</style>