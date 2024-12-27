<script lang="ts" setup>
import { computed } from 'vue';

const {command} = defineProps<{
  command: string;
}>();

const color = computed(() => {
  if (command.toLowerCase().includes('troque')) return 'red';
  if (command.toLowerCase().includes('revelar')) return 'blue';
  return 'defaultColor';
});
const colorObject = computed(() => {
  if (command.toLowerCase().includes('assento')) return 'purple';
  if (command.toLowerCase().includes('presente')) return 'green';
  return 'defaultColor';
});

const pillAction = computed(() => {
  if (command.toLowerCase().includes('troque')) return 'Troque';
  if (command.toLowerCase().includes('revelar')) return 'Revelar';
  return 'Comando';
});
const pillObject = computed(() => {
  if (command.toLowerCase().includes('presente')) return 'Presente';
  if (command.toLowerCase().includes('assento')) return 'Assento';
  return 'Comando';
});
</script>
<template>
  <div class="flex flex-row">
    <div :class="['pill', color]" class="nes-btn text-game text-white" style="text-align: center;">
      {{ pillAction }}
    </div>
    <div :class="['pill', colorObject]" class="nes-btn text-game text-white" style="text-align: center;">
      {{ pillObject }}
    </div>
  </div>
</template>
<style scoped>
.pill{
  border: 1px solid black;
  border-radius: 10px;
  padding: 5px;
  margin: 5px;
}
.red {
  background: linear-gradient(135deg, #ff4b1f, #ff9068);
}
.blue {
  background: linear-gradient(135deg, #1e3c72, #2a5298);
}
.purple {
  background: linear-gradient(135deg, #6a3093, #a044ff);
}
.green {
  background: linear-gradient(135deg, #00b09b, #96c93d);
}
.defaultColor {
  color: black;
}
</style>